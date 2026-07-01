import { useRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CameraScreen({ navigation }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();

  async function takePicture() {
    if (!cameraRef.current) return;

    const result = await cameraRef.current.takePictureAsync({
      quality: 0.7,
      base64: true,
    });

    navigation.navigate('Preview', {
      photoUri: result.uri,
      base64Image: result.base64,
    });
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          {Platform.OS === 'ios'
            ? 'VisionAI needs camera access. Tap below, then choose "Allow" in the dialog.'
            : 'VisionAI needs camera access. Tap below to grant the permission.'}
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <TouchableOpacity
        style={[styles.historyButton, { top: insets.top + 16 }]}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyButtonText}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.captureButton, { bottom: insets.bottom + 24 }]}
        onPress={takePicture}
      >
        <Text style={styles.captureButtonText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#2E5BBA',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    position: 'absolute',
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  historyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  permissionText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#2E5BBA',
    borderRadius: 8,
    padding: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
