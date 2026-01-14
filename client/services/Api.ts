import Constants from "expo-constants";

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || "http://192.168.29.242:3000/api"; // <- your PC IP
export const STATIC_FILES_URL =
  Constants.expoConfig?.extra?.staticFilesUrl || "http://192.168.29.242:3000"; // <- your PC IP
export const GOOGLE_MAPS_API_KEY =
  Constants.expoConfig?.extra?.googleMapsApiKey || "";
