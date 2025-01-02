import {View, Text, Image} from 'react-native';
import React from 'react';
import { commonStyles } from '@/styles/commonStyles';
import { splashStyles } from '@/styles/splashStyles';

const Main = () => {
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
        </View>
    )
}

export default Main;