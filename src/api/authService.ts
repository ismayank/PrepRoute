import axiosClient from "./axiosClient";
import type { AuthResponse, LoginInput } from "../types/auth";

export const login = async (
  credentials: LoginInput
): Promise<AuthResponse> => {
  try {
    const { data } = await axiosClient.post(
      "/auth/login",
      credentials
    );
    return data;
  } catch (error: any) {
    // Handle error properly
    console.error("Login failed:", error);
    // If API fails, throw error to let UI handle it
    throw error.response?.data || { 
      success: false, 
      message: error.message || "Login failed" 
    };
  }
};