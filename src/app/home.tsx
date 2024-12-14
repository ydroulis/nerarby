import { useEffect, useState } from "react";
import { View, Alert, Text } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from 'expo-location'
import { api } from "@/services/api";
import { Categories, CategoriesProps } from "@/components/Categories";
import { PlaceProps } from "@/components/Place";
import { Places } from "@/components/Places";
import { LocationObjectCoords } from "expo-location";
import { colors, fontFamily } from '@/styles/theme'
import { router } from "expo-router";
// import { Loading } from "@/components/Loading";

type MarketsProps = PlaceProps & {
    latitude: number,
    longitude: number
}

const currentLocation = {
    latitude: -23.561187293883442,
    longitude: -46.656451388116494
}

export default function Home(){
    const [categories, setCategories] = useState<CategoriesProps>([]);
    const [category, setCategory] = useState("");
    const [markets, setMarkets] = useState<MarketsProps[]>([]);
    const [location, setLocation] = useState<LocationObjectCoords>()

    async function fetchCategories(){
        try {
            const { data } = await api.get("/categories");
            setCategories(data)
            setCategory(data[0].id)
        } catch (error) {
            console.log(error)
            Alert.alert("Categorias, Não foi possível carregar as categorias")
        }
    }

    async function fetchMarkets(){
        try {
            if(!category) {
                return
            }

            const { data } = await api.get("/markets/category/" + category)
            setMarkets(data)
        } catch (error) {
            console.log(error)
            Alert.alert("Locais", "Não foi possível carregar os locais")
        }
    }

    async function getCurrentLocation(){ // usando localização real
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync()

            if(granted){
                const { coords } = await Location.getCurrentPositionAsync()
                setLocation(coords)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCategories()
        getCurrentLocation()
    }, [])

    useEffect(() => {
        fetchMarkets()
    }, [category])
    
    return(
        <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
            <Categories data={categories} onSelect={setCategory} selected={category}/>

            {/* {location ? (  usando localização real*/} 
                <MapView 
                    style={{ flex: 1 }}
                    initialRegion={{ 
                        // latitude: location.latitude, usando localização real
                        // longitude: location.longitude, usando localização real
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01
                    }}
                >
                    <Marker 
                        identifier="current" 
                        coordinate={{
                            // latitude: location.latitude, usando localização real
                            // longitude: location.longitude usando localização real
                            latitude: currentLocation.latitude, 
                            longitude: currentLocation.longitude,
                        }}
                        image={require("@/assets/location.png")}
                    />

                    {
                        markets.map((item) => (
                            <Marker
                                key={item.id}
                                identifier={item.id}
                                coordinate={{
                                    latitude: item.latitude,
                                    longitude: item.longitude
                                }}
                                image={require("@/assets/pin.png")}
                            >
                               <Callout onPress={() => router.navigate(`../market/${item.id}`)}>
                                    <View>
                                        <Text 
                                            style={{
                                                fontSize: 14,
                                                color: colors.gray[600],
                                                fontFamily: fontFamily.medium
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: colors.gray[600],
                                                fontFamily: fontFamily.regular
                                            }}
                                        >
                                            {item.address}
                                        </Text>
                                    </View>
                               </Callout>
                            </Marker>
                        ))
                    }
                </MapView>
            {/* ) : <Loading/>} usando localização real */}

            <Places data={markets}/>
        </View>
    )
}