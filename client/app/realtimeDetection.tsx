import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";

export default function RealtimeDetectionScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [threshold, setThreshold] = useState(0.5);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { Camera } from "expo-camera";
import { CameraType } from "expo-camera/build/Camera.types";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";

export default function RealtimeDetectionScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [threshold, setThreshold] = useState(0.5);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const cameraRef = useRef<Camera | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const runningRef = useRef(true);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locationStatus === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      }
    })();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.151.244:8000/ws");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      startSendingFrames();
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDetections(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onerror = (error) => console.error("WebSocket error:", error);
    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      runningRef.current = false;
    };

    return () => {
      runningRef.current = false;
      ws.current?.close();
    };
  }, []);

  const startSendingFrames = async () => {
    runningRef.current = true;
    while (runningRef.current && ws.current?.readyState === WebSocket.OPEN) {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
        });
        const metadata = { threshold, latitude, longitude };

        ws.current.send(JSON.stringify(metadata));
        ws.current.send(photo.base64);

        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Realtime Detection
      </Text>

      <Camera
        ref={cameraRef}
        style={{ width: "100%", height: 400 }}
        type={CameraType?.back || 0} // Fallback to 0 (default camera type)
      />

      <Text>Confidence Threshold: {threshold.toFixed(2)}</Text>
      <Slider
        value={threshold}
        onValueChange={setThreshold}
        minimumValue={0}
        maximumValue={1}
        step={0.05}
        style={{ width: 200 }}
      />

      <FlatList
        data={detections}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.label} ({(item.score * 100).toFixed(1)}%)
          </Text>
        )}
      />
    </View>
  );
}

  const [detections, setDetections] = useState<any[]>([]);

  // ✅ Correct ref type for Expo SDK 54 Camera
  const cameraRef = useRef<CameraView | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const runningRef = useRef(true);
  const navigation = useNavigation();

  // -------------------- PERMISSIONS --------------------
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (locationStatus === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      }
    })();
  }, []);

  // -------------------- WEBSOCKET --------------------
  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.151.244:8000/ws");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      startSendingFrames();
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDetections(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.current.onerror = (error) => console.error("WebSocket error:", error);

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      runningRef.current = false;
    };

    return () => {
      runningRef.current = false;
      ws.current?.close();
    };
  }, []);

  // -------------------- SEND FRAMES --------------------
  const startSendingFrames = async () => {
  runningRef.current = true;

  while (runningRef.current && ws.current?.readyState === WebSocket.OPEN) {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });

      // Prevent TS errors + avoid sending empty frames
      if (!photo || !photo.base64) {
        console.warn("Photo or base64 missing, skipping frame...");
        continue;
      }

      const metadata = { threshold, latitude, longitude };

      ws.current.send(JSON.stringify(metadata));
      ws.current.send(photo.base64);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }
};


  // -------------------- UI --------------------
  if (hasPermission === null) {
    return (
      <View>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 40 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Realtime Detection
      </Text>

      {/* ✅ Correct Camera component for SDK 54 */}
      <CameraView
        ref={cameraRef}
        style={{ width: "100%", height: 400 }}
        facing="back"
      />

      <Text>Confidence Threshold: {threshold.toFixed(2)}</Text>

      <Slider
        value={threshold}
        onValueChange={setThreshold}
        minimumValue={0}
        maximumValue={1}
        step={0.05}
        style={{ width: 200 }}
      />

      <FlatList
        data={detections}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.label} ({(item.score * 100).toFixed(1)}%)
          </Text>
        )}
      />
    </View>
  );
}
