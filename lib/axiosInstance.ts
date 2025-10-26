// /axiosInstance.ts
import axios from "axios";

// Create instance
const axiosApiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000/api/v1/", // your backend URL
    withCredentials: true,
});

export default axiosApiInstance;