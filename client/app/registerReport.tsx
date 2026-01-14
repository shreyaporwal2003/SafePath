import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as ImagePicker from "expo-image-picker";
import { ReportService } from "@/services/ReportService";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "expo-router";
import { GOOGLE_MAPS_API_KEY } from "@/services/Api";

export default function RegisterReportScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  // Fetch User's Current Location Initially
  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Enable location permissions in settings."
        );
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarker({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  const moveToCurrentLocation = async () => {
    setButtonLoading(true);
    let location = await Location.getCurrentPositionAsync({});
    setRegion((prev) => ({
      ...prev!,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }));
    setMarker({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setButtonLoading(false);
  };

  // Select Photo from Gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Allow access to the gallery in settings."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Save Report
  const saveReport = async () => {
    if (!name || !description) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (!marker || !marker.latitude || !marker.longitude) {
      Alert.alert(
        "Location Required",
        "Please fetch your location before submitting.",
        [{ text: "OK", onPress: moveToCurrentLocation }]
      );
      return;
    }

    setSubmitting(true);

    const userId = (await AuthService.getUserId()) ?? "";

    try {
      const formData = new FormData();

      // Append text data
      formData.append("user_id", userId);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("latitude", `${marker.latitude}`);
      formData.append("longitude", `${marker.longitude}`);

      // Append photo if available
      if (photo) {
        const filename = photo.split("/").pop();
        const match = /\.(\w+)$/.exec(filename!);
        const type = match ? `image/${match[1]}` : "image/jpeg"; // Default to jpeg

        formData.append("photo", {
          uri: photo,
          name: filename,
          type,
        } as any);
      } else {
        formData.append("photo", "");
      }

      await ReportService.registerReport(formData);

      Alert.alert("Success", "Report has been registered!", [
        { text: "OK", onPress: () => router.push("/report") },
      ]);
      setName("");
      setDescription("");
      setPhoto(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("API Error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      Alert.alert("Error", "Failed to submit the report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Fetching Location...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <View style={styles.container}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter Name"
          />
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter Description"
            multiline
          />
          <Text style={styles.label}>Search Location:</Text>
          <GooglePlacesAutocomplete
            placeholder="Search for a location"
            onPress={(data, details = null) => {
              if (details) {
                const { lat, lng } = details.geometry.location;
                setMarker({ latitude: lat, longitude: lng });
                setRegion({
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }
            }}
            fetchDetails
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "en",
            }}
            styles={{
              textInput: styles.input,
              listView: {
                position: "absolute",
                top: 45,
                zIndex: 100,
                backgroundColor: "#fff",
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              },
            }}
          />
          <Text style={styles.label}>Select Location:</Text>
          {region && (
            <MapView
              style={styles.map}
              region={region}
              onPress={(e) => setMarker(e.nativeEvent.coordinate)}
            >
              {marker && <Marker coordinate={marker} />}
            </MapView>
          )}
          <View style={styles.buttonContainer}>
            {buttonLoading ? (
              <ActivityIndicator size="small" color="blue" />
            ) : (
              <Button
                title="Use Current Location"
                onPress={moveToCurrentLocation}
              />
            )}
          </View>
          <Text style={styles.label}>Photo:</Text>
          <View style={styles.imageContainer}>
            {photo && <Image source={{ uri: photo }} style={styles.image} />}
          </View>
          <Button title="Pick an Image" onPress={pickImage} />
          {submitting ? (
            <ActivityIndicator size="small" color="green" />
          ) : (
            <Button title="Submit Report" onPress={saveReport} color="green" />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  map: { width: "100%", height: 250, marginTop: 10 },
  image: { width: 100, height: 100, marginTop: 10, borderRadius: 5 },
  imageContainer: { padding: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
});
