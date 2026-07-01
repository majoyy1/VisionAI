import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PreviewScreen({ navigation, route }) {
  const { photoUri, base64Image } = route.params;

  function analyzePhoto() {
    navigation.navigate('Result', { photoUri, base64Image });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={analyzePhoto}>
          <Text style={styles.buttonText}>Analyze</Text>
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
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#000',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2E5BBA',
    borderRadius: 10,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
