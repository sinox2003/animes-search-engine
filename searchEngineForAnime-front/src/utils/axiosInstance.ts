import axios from "axios";
import {authService} from "../services/authService";

// Base API URL
const API_URL = "http://localhost:8080/api";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to validate the token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the token from local storage
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        // Validate the token before making the request
        await authService.validateToken(token);

        // If valid, add the token to the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Token validation failed:", error);

        // Handle invalid token
        localStorage.removeItem("authToken"); // Remove invalid token
        window.location.href = "/"; // Redirect to login page or handle logout
        throw new Error("Invalid token");
      }
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiry or errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized: Redirecting to login");

      // Handle unauthorized errors (e.g., token expired)
      localStorage.removeItem("authToken"); // Remove invalid token
      window.location.href = "/"; // Redirect to login page or handle logout
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
