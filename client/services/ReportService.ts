import axios from "axios";
import { API_BASE_URL } from "./Api";

export const ReportService = {
  registerReport: async (data: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/report/register`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  getReportsByUserId: async (user_id: string | null) => {
    console.log(user_id);
    const response = await axios.get(`${API_BASE_URL}/report/user/${user_id}`);
    return response;
  },
};
