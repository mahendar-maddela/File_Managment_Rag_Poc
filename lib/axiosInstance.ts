// /axiosInstance.ts
import axios from "axios";

// Create instance
const axiosApiInstance = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/", // your backend URL
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://ragpocfastapiserver-production.up.railway.app/api/v1/",
    withCredentials: true,
});

export default axiosApiInstance;