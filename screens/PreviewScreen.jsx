import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PROMPT_LABELS } from '../lib/prompts';

export default function PreviewScreen({ navigation, route }) {
  const { photoUri, base64Image } = route.params;

  function goAnalyze(promptKey) {
    navigation.navigate('Result', { photoUri, base64Image, promptKey });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <View style={styles.personaPanel}>
        <Text style={styles.personaTitle}>Choose an analysis style</Text>
        {Object.entries(PROMPT_LABELS).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={styles.personaButton}
            onPress={() => goAnalyze(key)}
          >
            <Text style={styles.personaLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Retake</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  actions: {
    padding: 20,
    backgroundColor: '#000',
  },
  personaPanel: {
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#000',
  },
  personaTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  personaButton: {
    alignItems: 'center',
    backgroundColor: '#2E5BBA',
    borderRadius: 10,
    paddingVertical: 13,
  },
  personaLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2E5BBA',
    borderRadius: 10,
    paddingVertical: 14,
  },
  secondaryButton: {
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#2E5BBA',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
