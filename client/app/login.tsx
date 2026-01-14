// client/app/login.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthService } from "@/services/AuthService";
import { useSnackbar } from "@/context/SnackbarContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    const { email, password } = form;
    if (!email || !password) {
      showSnackbar("Please enter both email and password.", "error");
      return;
    }

    try {
      const response = await AuthService.login(form);

      showSnackbar("Logged in successfully!", "success");
      setForm({ email: "", password: "" });
      router.push("/"); // navigate to home
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Login failed";
      showSnackbar(errorMessage, "error");
    }
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="account-circle" size={80} color="#2D8CFF" />
      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          value={form.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <MaterialCommunityIcons
            name={passwordVisible ? "eye-off" : "eye"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f7fa" },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 20, color: "#333" },
  inputContainer: { flexDirection: "row", alignItems: "center", width: "100%", backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 12, marginVertical: 10 },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: "#333" },
  loginButton: { backgroundColor: "#2D8CFF", paddingVertical: 12, borderRadius: 10, width: "100%", alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  signupText: { marginTop: 15, color: "#2D8CFF", fontWeight: "bold", fontSize: 14 },
});
