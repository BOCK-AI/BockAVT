import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { useUserStore } from '@/store/userStore';
import { calculateFare } from '@/utils/mapUtils';
import { rideStyles } from '@/styles/rideStyles';
import { StatusBar } from 'expo-status-bar';
import CustomText from '@/components/shared/CustomeText';
import { commonStyles } from '@/styles/commonStyles';

const RideBooking = () => {

    const route = useRoute() as any;
    const item = route?.params as any;
    const { location } = useUserStore() as any;
    const [selectedOption, setSelectedOption] = useState("Bike");
    const [loading, setLoading] = useState(false)
    const farePrices = useMemo(() => calculateFare(parseFloat(item?.distanceInKm)), [item?.distanceInKm])
    const rideOptions = useMemo(() => [
        { type: "Bike", seats: 1, time: '1 min', droptime: '4:28 pm', price: farePrices?.bike, isFastest: true, icon: require('@/assets/images/bike.png') },
        { type: "Auto", seats: 3, time: '1 min', droptime: '4:28 pm', price: farePrices?.auto, icon: require('@/assets/images/auto.png') },
        { type: "Cab Economy", seats: 4, time: '1 min', droptime: '4:28 pm', price: farePrices?.cabEconomy, icon: require('@/assets/images/cab.png') },
        { type: "Cab Premium", seats: 4, time: '1 min', droptime: '4:28 pm', price: farePrices?.cabPremium, icon: require('@/assets/images/cab_premium.png') },
    ], [farePrices])

    const handleOptionSelect = useCallback((type: string) => {
        setSelectedOption(type)
    }, [])
    return (
        <View style={rideStyles.container}>
            <StatusBar
                style='light'
                backgroundColor='orange'
                translucent={false}
            />

            <View style={rideStyles.rideSelectionContainer}>
                <View style={rideStyles?.offerContainer}>
                    <CustomText fontSize={12} style={rideStyles.offerText}>
                        You get 10 off 5 coins cashback!
                    </CustomText>
                </View>
                <ScrollView contentContainerStyle={rideStyles?.scrollContainer} showsVerticalScrollIndicator={false}>
                    {rideOptions?.map((ride, index) => (
                        <RideOption
                            key={index}
                            ride={ride}
                            selected={selectedOption}
                            onSelect={handleOptionSelect}
                        />
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

const RideOption = memo(({ ride, selected, onSelect }: any) => (
    <TouchableOpacity
        onPress={() => onSelect(ride?.type)}
        style={[
            rideStyles.rideOption,
            { borderColor: selected === ride.type ? "#222" : '#ddd' }
        ]}
    >
        <View style={commonStyles.flexRowBetween}>
            <Image source={ride?.icon} style={rideStyles?.rideIcon} />
            <View style={rideStyles?.rideDetails}>
                <CustomText fontFamily='Medium' fontSize={12}>
                    {ride?.type} {ride?.isFastest && <Text style={rideStyles.fastestLabel}>FASTEST</Text>}
                </CustomText>
                <CustomText fontSize={10}>
                    {ride?.seats} seats • {ride?.time} away • Drop{ride?.droptime}
                </CustomText>
            </View>
            <View style={rideStyles?.priceContainer} >
                <CustomText fontFamily='Medium' fontSize={14} >
                    ₹{ride?.price?.toFixed(2)}
                </CustomText>
                {selected === ride?.type && <Text style={rideStyles?.discountedPrice} > </Text> }
            </View>
        </View>
    </TouchableOpacity>
))

export default memo(RideBooking)