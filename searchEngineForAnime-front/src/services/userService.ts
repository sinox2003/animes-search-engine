import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import {Simulate} from "react-dom/test-utils";


const API_URL = "http://localhost:8080/api/users";


export const
    userService = {
    verifyUser: async (email: string, verificationCode: string) => {
        try {
            const response = await axios.post(`${API_URL}/verify`, { email, verificationCode });
            return response.data;
        } catch (error) {
            if (error.response) {
                return error.response.data;
            } else {
                return "Verification failed";
            }
        }
    },

    resendVerificationCode: async (email: string) => {
        console.log("first",email);
        try {
            const response = await axios.post(`${API_URL}/resend-code`, {email});
            return response.data;
        }catch(err) {
            if (err.response) {
                return err.response.data;
            }else{
                return "Sending code failed"
            }
        }
    },

    forgotPassword : async (email: string) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {email});
            return response.data;
        }catch(err) {
            if (err.response) {
                return err.response.data;
            }else{
                return "Sending code failed"
            }
        }
    },

    resetPassword : async (password: string) => {

        try {
            const response = await axios.post(`${API_URL}/reset-password`, {password});
            return response.data;
        }catch(err) {
            if (err.response) {
                return err.response.data;
            }else{
                return "Reset Password Failed"
            }
        }
    },

    getNameById: async (id: number) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/get-name/${id}`);
            return response.data; // Assuming the endpoint returns a string (user's name)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // Narrowing the error to AxiosError type
                return err.response?.data || "Failed to fetch user name";
            } else {
                return "An unexpected error occurred";
            }
        }
    },
    
    // getAnimesByUserId: async (userId: number) => {
    //     try {
    //         const response = await axiosInstance.get(`${API_URL}/${userId}/animes`);
    //         return response.data; // Assuming the endpoint returns a list of anime DTOs
    //     } catch (err) {
    //         if (axios.isAxiosError(err)) {
    //             // Handle Axios-specific errors
    //             return err.response?.data || "Failed to fetch animes";
    //         } else {
    //             return "An unexpected error occurred";
    //         }
    //     }
    // },



    getPaginatedAnimes: async (userId: number, page: number = 0, size: number = 10) => {
        try {
          const response = await axiosInstance.get(`/users/${userId}/animes`, {
            params: { page, size },
          });
          return response.data;
        } catch (err) {
          console.error("Failed to fetch paginated animes:", err);
          throw err;
        }
      },
    
      removeAnimeFromUser: async (userId: number, animeId: number) => {
        try {
            const response = await axiosInstance.delete(`/users/${userId}/animes/${animeId}`);
            return response.data; // Assuming the backend sends a success message as a response
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Failed to remove anime:", err.response?.data || err.message);
                throw new Error(err.response?.data || "Failed to remove anime.");
            } else {
                console.error("An unexpected error occurred:", err);
                throw new Error("An unexpected error occurred.");
            }
        }
    },


        addAnimeToUser: async (userId: number, animeId: number) => {
            try {
                const response = await axiosInstance.post(`/users/${userId}/animes/${animeId}`);
                return response.data; // Assuming the backend sends a success message as a response
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.error("Failed to remove anime:", err.response?.data || err.message);
                    throw new Error(err.response?.data || "Failed to remove anime.");
                } else {
                    console.error("An unexpected error occurred:", err);
                    throw new Error("An unexpected error occurred.");
                }
            }
        },
    

}