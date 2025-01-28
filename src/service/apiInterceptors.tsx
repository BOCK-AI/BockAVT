import axios from "axios";
// import { BASE_URL } from "./config";
import { tokenStorage } from "@/store/storage";

import { BASE_URL } from "./config";
import { logout } from "./authService";

export const appAxios = axios.create({
    baseURL: BASE_URL,
})

export const refresh_tokens = async () => {
    try {
        const refreshToken = tokenStorage.getString('refresh_token')
        const response = await appAxios.post(`${BASE_URL}/auth/refresh-tokens`, { 
            refreshToken: refreshToken 
        })

        const new_access_token = response.data.access_token
        const new_refresh_token = response.data.access_token
        
        tokenStorage.set('access_token', new_access_token)
        tokenStorage.set('refresh_token', new_refresh_token)
        return new_access_token
    
    } catch (error) {
        console.log("REFRESH TOKEN ERROR");
        tokenStorage.clearAll

        logout()
    }
}   

appAxios.interceptors.request.use(async (config) => {
    const accessToken = tokenStorage.getString('access_token')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

appAxios.interceptors.response.use(
    response => response,   
    async (error) => {
        if( error.response && error.response.status === 401){  
            try {
                const accessToken = await refresh_tokens()
                if(accessToken)
                    error.config.headers['Authorization'] = `Bearer ${accessToken}`
                return appAxios(error.config)
            }
            catch (error) {
                console.log("REFRESH TOKEN ERROR");
                logout()
            }
        }

        // if (error.response && error.response.status === 403) {
        //     logout()
        // }

        return Promise.reject(error)
    }
)