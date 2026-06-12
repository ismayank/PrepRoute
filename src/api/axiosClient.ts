import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Log all requests
axiosClient.interceptors.request.use(
  (config) => {
    console.log("🔵 API Request:", {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });
    // Don't add Authorization header for login endpoint
    if (!config.url?.includes("/auth/login")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Log all responses
axiosClient.interceptors.response.use(
  (response) => {
    console.log("🟢 API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.group("🔴 API Error Details");
    console.log("URL:", error.config?.url);
    console.log("Method:", error.config?.method);
    console.log("Status:", error.response?.status);
    console.log("Status Text:", error.response?.statusText);
    console.log("Request Data:", error.config?.data);
    console.log("Request Data (parsed):", error.config?.data ? JSON.parse(error.config.data) : null);
    console.log("Response Data:", error.response?.data);
    console.log("Response Data (stringified):", JSON.stringify(error.response?.data, null, 2));
    console.log("Error Message:", error.message);
    console.groupEnd();
    return Promise.reject(error);
  }
);

export default axiosClient;