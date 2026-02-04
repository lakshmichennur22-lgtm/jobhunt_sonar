import axios from "axios";

// Create an axios instance with base URL from .env
const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Function to search jobs by skill
export const searchJobs = async (skill) => {
    try {
        const response = await API.get(`/searchJobs?skill=${encodeURIComponent(skill)}`);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export default API;
