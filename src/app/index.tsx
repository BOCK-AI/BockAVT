import {View, Text, Image, Alert} from 'react-native';
import React from 'react';
import { commonStyles } from '@/styles/commonStyles';
import { splashStyles } from '@/styles/splashStyles';
import CustomText from '@/components/shared/CustomeText';
import { jwtDecode } from 'jwt-decode';

// import { useFonts } from 'expo-font';
import Role from './role';
import { refresh_tokens } from '@/service/apiInterceptors';
// import { Href } from '@/utils/Helpers';

interface DecodedToken {
    exp: number;
}

const Main = () => {

    const [loaded]=useFonts({
        Bold: require('@/assets/fonts/NotoSans-Bold.ttf'),
        Regular: require('@/assets/fonts/NotoSans-Regular.ttf'),
        Medium: require('@/assets/fonts/NotoSans-Medium.ttf'),
        Light: require('@/assets/fonts/NotoSans-Light.ttf'),
        // Thin: require('@/assets/fonts/Poppins-Thin.ttf'),
        SemiBold: require('@/assets/fonts/NotoSans-SemiBold.ttf'),
    })

    const { user} = useUserStore();

    const [hasNavigated, setHasNavigated] = useState(false);

    const tokenCheck = async () => {

        const access_token = tokenStorage.getString('access_token') as string;
        const refresh_token= tokenStorage.getString('access_token') as string;

        if(access_token){
        
            const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
            const decodedRefreshToken = jwtDecode<DecodedToken>(access_token);

            const currentTime = Date.now() / 1000;
            if(decodedAccessToken.exp < currentTime || decodedRefreshToken.exp < currentTime){
                resetAndNavigate({ pathname: './role' });
                Alert.alert('Error', 'Session expired, please login again');
            }
            if(decodedAccessToken?.exp < currentTime ){
                try{
                    refresh_tokens()
                }catch(error){
                    console.log('Error refreshing token', error);
                    Alert.alert('Error', 'Session expired, please login again');
                }
            }
            
            if(user){
                resetAndNavigate({ pathname: './customer/home' });
            }else{
                resetAndNavigate({ pathname: './captain/home' });
            }

            return
        }

        resetAndNavigate({ pathname: './role' });
    }
    useEffect(() => {
        if (loaded && !hasNavigated) {
            const timeoutId = setTimeout(() => {
                tokenCheck()
                setHasNavigated(true);
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [loaded, hasNavigated]);

    return (    
        <View style={commonStyles.container}>
            {/* <Image
                source={require('@/assets/images/logo_t.png')} 
                style=(splashStyles.img)
            /> */}
            <Image
                source={require('@/assets/images/logo_t.png')} 
                style={splashStyles.img}
            />
            <CustomText variant='h5' fontFamily='Medium' style={splashStyles.text}>
                Made with ❤️ by Team 
            </CustomText>   
        </View>
    )
}

export default Main;
import * as Font from 'expo-font';
import { useState, useEffect } from 'react';
import { resetAndNavigate } from '@/utils/Helpers';
import { tokenStorage } from '@/store/storage';
import { useUserStore } from '@/store/userStore';

function useFonts(fontMap: { [key: string]: any }): [boolean] {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync(fontMap);
                setLoaded(true);
            } catch (error) {
                console.error('Error loading fonts', error);
            }
        }

        loadFonts();
    }, []);

    return [loaded];
}


// function useFonts(arg0: {}): [any] {
//     throw new Error('Function not implemented.');
// }
