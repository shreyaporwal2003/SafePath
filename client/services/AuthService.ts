import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "./Api";

export const AuthService = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);
    if (response.status === 201) {
      const token = response.data?.token;
      const user = response.data?.user;
      if (token) {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("user_id", user._id);
      }
    }
    return response;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    if (response.status === 200) {
      const token = response.data?.token;
      const user = response.data?.user;
      if (token) {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("user_id", user._id);
      }
    }
    return response;
  },

  updateProfile: async (data: { name: string; avatar: string }, token: string) => {
    const response = await axios.put(`${API_BASE_URL}/auth/update`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  },

  getToken: async () => await SecureStore.getItemAsync("token"),
  clearToken: async () => await SecureStore.deleteItemAsync("token"),
  getUserId: async () => await SecureStore.getItemAsync("user_id"),
  clearUserId: async () => await SecureStore.deleteItemAsync("user_id"),
};
