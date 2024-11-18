import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function HomeScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [barcodeBounds, setBarcodeBounds] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: async (qrdata) => {
      return await axios.put(
        "http://eduapi.senaycreatives.com/cafe/check/meal/",
        { qrurl: qrdata }
      );
    },
    onSuccess: async (response) => {
      setSuccess(response.data);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    },
    onError: (error) => {
      setError(error.response.data);
      setTimeout(() => {
        setError("");
      }, 3000);
    },
    mutationKey: ["todos"],
  });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarcodeScanned = ({ bounds, data }) => {
    if (bounds && bounds.origin && bounds.size) {
      setBarcodeBounds(bounds);
      mutation.mutate(data);
      setTimeout(() => {
        setBarcodeBounds(null);
      }, 1000);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      setBarcodeBounds(null);
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {mutation.isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <CameraView
            barcodeScannerSettings={{ barcodeTypes: "qr" }}
            style={styles.camera}
            onBarcodeScanned={handleBarcodeScanned}
            facing={facing}
          >
            {barcodeBounds && (
              <View
                style={[
                  styles.boundingBox,
                  {
                    top: barcodeBounds.origin.y,
                    left: barcodeBounds.origin.x,
                    width: barcodeBounds.size.width,
                    height: barcodeBounds.size.height,
                  },
                ]}
              />
            )}
          </CameraView>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Messages */}
      <View style={styles.statusContainer}>
        {error ? (
          <Text style={[styles.statusText, styles.errorText]}>{error}</Text>
        ) : success ? (
          <Text style={[styles.statusText, styles.successText]}>{success}</Text>
        ) : (
          <Text style={styles.statusText}>Scan a QR Code</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cameraContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 2 },
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  boundingBox: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#ff0000",
    borderRadius: 10,
    zIndex: 10,
  },
  statusContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "500",
  },
  errorText: {
    color: "#ff4d4d",
    backgroundColor: "#ffe6e6",
    padding: 10,
    borderRadius: 10,
  },
  successText: {
    color: "#28a745",
    backgroundColor: "#e6ffee",
    padding: 10,
    borderRadius: 10,
  },
  message: {
    fontSize: 18,
    color: "#333",
    margin: 20,
    textAlign: "center",
  },
});
