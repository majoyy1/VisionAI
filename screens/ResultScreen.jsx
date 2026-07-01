import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { analyzeImage } from '../lib/gemini';
import { PROMPT_LABELS, PROMPTS } from '../lib/prompts';
import { supabase, supabaseConfigured } from '../lib/supabase';

export default function ResultScreen({ navigation, route }) {
  const { photoUri, base64Image, promptKey = 'academic' } = route.params;
  const prompt = PROMPTS[promptKey] || PROMPTS.academic;
  const promptLabel = PROMPT_LABELS[promptKey] || PROMPT_LABELS.academic;
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function runAnalysis() {
      try {
        const analysis = await analyzeImage(base64Image, prompt);
        if (isMounted) {
          setResult(analysis);
        }
        saveToHistory(analysis, promptLabel);
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to analyze the image.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [base64Image, prompt]);

  async function saveToHistory(analysis, label) {
    if (!supabaseConfigured) return;

    try {
      await supabase.from('analysis_history').insert({
        objects: analysis.objects.join(', '),
        context: analysis.context,
        recommendations: `[${label}] ${analysis.recommendations}`,
      });
    } catch (err) {
      console.warn('Failed to save history:', err);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.thumbnail} />
      <Text style={styles.personaTitle}>{promptLabel}</Text>

      {loading ? (
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" color="#2E5BBA" />
          <Text style={styles.loadingText}>Analyzing image...</Text>
        </View>
      ) : null}

      {!loading && error ? (
        <View style={styles.centerBlock}>
          <Text style={styles.errorTitle}>Analysis failed</Text>
          <Text style={styles.errorText}>{error}</Text>
          {error.includes('Gemini API key') ? (
            <Text style={styles.helpText}>
              Open .env, replace your_key_here with your real Google AI Studio
              key, then restart Expo with npx expo start -c.
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {!loading && result ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Objects</Text>
          {result.objects.map((item, index) => (
            <Text key={`${item}-${index}`} style={styles.objectItem}>
              - {item}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Context</Text>
          <Text style={styles.bodyText}>{result.context}</Text>

          <Text style={styles.sectionTitle}>Activity</Text>
          <Text style={styles.bodyText}>{result.activity}</Text>

          <Text style={styles.sectionTitle}>Recommendations</Text>
          <Text style={styles.bodyText}>{result.recommendations}</Text>

          <TouchableOpacity
            style={styles.compareButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.compareButtonText}>Try Another Persona</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F7FB',
    padding: 16,
  },
  thumbnail: {
    width: '100%',
    height: 240,
    resizeMode: 'contain',
    backgroundColor: '#000',
    borderRadius: 8,
    marginBottom: 16,
  },
  personaTitle: {
    color: '#2E5BBA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#333',
    fontSize: 16,
  },
  errorTitle: {
    color: '#B00020',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  helpText: {
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2E5BBA',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    color: '#2E5BBA',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  objectItem: {
    color: '#222',
    fontSize: 15,
    lineHeight: 22,
  },
  bodyText: {
    color: '#222',
    fontSize: 15,
    lineHeight: 22,
  },
  compareButton: {
    alignItems: 'center',
    backgroundColor: '#2E5BBA',
    borderRadius: 8,
    marginTop: 20,
    paddingVertical: 12,
  },
  compareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
