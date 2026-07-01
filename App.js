import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);

  async function takePicture() {
    if (!cameraRef.current) return;

    const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    setPhoto(result.uri);
    console.log('Captured photo:', result.uri);
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
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
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureButtonText}>Capture</Text>
      </TouchableOpacity>
      {photo ? (
        <View style={styles.photoBadge}>
          <Text style={styles.photoBadgeText}>Photo captured</Text>
        </View>
      ) : null}
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
    bottom: 40,
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
  photoBadge: {
    position: 'absolute',
    top: 48,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  photoBadgeText: {
    color: '#fff',
    fontWeight: '600',
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
