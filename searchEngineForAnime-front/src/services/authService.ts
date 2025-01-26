import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

interface User{
    name: string;
    email: string;
    password: string;

}

interface AuthRequest {
    email: string;
    password: string;
}

export const authService = {
    registerUser: async (userData: User) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        }catch(err) {
            console.log(err)
            throw err.response?.data || "registration failed";
        }
    },

    loginUser: async (authData: AuthRequest) => {
        try {
            const response = await axios.post(`${API_URL}/authenticate`, authData);
            return response.data;
        }catch(err) {
            console.log(err)
            throw err.response?.data || "Login failed";
        }
    },
    
    validateToken: async (token: string) => {
        try {
            const response = await axios.get(`${API_URL}/validate-token`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Returns the success message from the server
        } catch (err: any) {
            throw err.response?.data || "Token validation failed";
        }
    }
};