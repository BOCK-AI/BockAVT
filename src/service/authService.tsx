import { useCaptainStore } from "@/store/captainStore"
import { userStore } from "@/store/userStore"
import { tokenStorage } from "@/store/storage"
import { resetAndNavigate } from "@/utils/Helpers"
import { Alert } from "react-native"
import axios from "axios"

export const signin = async (payload: {
    role: 'customer' | 'captain',
    phone: string,
},
    updateAccessToken: () => void,
) => {
    const {setUser} = userStore().getState()
    const {setUser : setCaptainUser} = useCaptainStore().getState()

    try{
        const response = await axios.post('/auth/signin', payload)
        if(response.data.role === 'customer'){
            setUser(response.data.user)
            resetAndNavigate('/customer/home')
        }else{
            setCaptainUser(response.data.user)
        }

tokenStorage.set('access_token', response.data.access_token)
tokenStorage.set('refresh_token', response.data.refresh_token)

if(response.data.role === 'customer'){
    resetAndNavigate('/customer/home')
}
else{
    resetAndNavigate('/captain/home')
}
updateAccessToken()
    }catch(error : any){
        Alert.alert('Error', error.message)
        console.log(error)
    }
}

export const logout = async()=> {
    const {clearData} = userStore().getState()   
    const {clearCaptainData} = useCaptainStore().getState()   
 
    tokenStorage.clearAll()
    clearCaptainData
    clearData
    resetAndNavigate('/role')
}