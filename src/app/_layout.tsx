import {View, Text, Image, StyleSheet} from 'react-native';
import React, { FC } from 'react';
import { Stack } from 'expo-router';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import { WSProvider } from '@/service/WSProvider';


    const Layout = () => {
        return (
            <WSProvider>
                <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name='index' />
                <Stack.Screen name='role' /> 
                <Stack.Screen name='customer/auth' />
                <Stack.Screen name='captain/auth' />
                <Stack.Screen name='customer/home' />
                <Stack.Screen name='captain/home' />
                <Stack.Screen name='customer/selectlocations' />
                <Stack.Screen name='customer/ridebooking' />

            </Stack>
            </WSProvider>
        )
    }

    export default gestureHandlerRootHOC(Layout)