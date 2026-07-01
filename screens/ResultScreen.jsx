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

const ANALYSIS_PROMPT = `Analyze this image and return only valid JSON with this exact shape:
{
  "objects": ["object 1", "object 2"],
  "context": "One short paragraph describing the scene.",
  "activity": "What appears to be happening in the image.",
  "recommendations": "Practical recommendations based on what you see."
}`;

export default function ResultScreen({ navigation, route }) {
  const { photoUri, base64Image } = route.params;
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function runAnalysis() {
      try {
        const analysis = await analyzeImage(base64Image, ANALYSIS_PROMPT);
        if (isMounted) {
          setResult(analysis);
        }
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
  }, [base64Image]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.thumbnail} />

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
          {(result.objects || []).map((item, index) => (
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
});
