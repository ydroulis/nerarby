import { useEffect, useState, useRef } from "react";
import { View, Alert, Modal, StatusBar, ScrollView } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useCameraPermissions, CameraView } from 'expo-camera'
import { api } from "@/services/api";
import { Loading } from "@/components/Loading";
import { Cover } from "@/components/Market/Cover";
import { Details, PropsDetails } from "@/components/Market/Details";
import { Coupon } from "@/components/Market/Coupon";
import { Button } from "@/components/Button";

type DataProps = PropsDetails & {
    cover: string
}

export default function Market(){
    const [data, setData] = useState<DataProps>()
    const [coupon, setCoupon] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false)
    const [couponIsFetching, setCouponIsFetching] = useState(false)

    const [ _, requestPermission ] = useCameraPermissions()
    const params = useLocalSearchParams<{ id: string }>()
    console.log("🚀 ~ Market ~ params:", params.id)

    const qrLock = useRef(false)

    async function fetchMarket(){
        try {
            const { data } = await api.get(`/markets/${params.id}`)
            setData(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            Alert.alert('Erro', "Não foi possível carregar os dados", [
                { text: "OK", onPress: () => router.back()}
            ])
        }
    }

    async function handleOpenCamera(){
        try { 
            const { granted } = await requestPermission()

            if(!granted){
                return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera")
            }

            qrLock.current = false
            setIsVisibleCameraModal(true)
        } catch (error) {
            console.log(error)
            Alert.alert("Câmera", "Não foi possível utilizar a câmera")
        }
    }

    async function getCoupon(id: string){
        try {
            setCouponIsFetching(true)

            const { data } = await api.patch("/coupons/" + id)

            Alert.alert("Cupom", data.coupon);
            setCoupon(data.coupon)
        } catch (error) {
            console.log(error)
            Alert.alert("Erro", "Não foi possível utilizar o cupom")
        } finally {
            setCouponIsFetching(false)
        }
    }

    function handleUseCoupon(id: string){
        setIsVisibleCameraModal(false)

        Alert.alert("Cupom", "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?", [
            { style: "cancel", text: "Não"},
            { text: "Sim", onPress: () => getCoupon(id)}
        ])
    }

    useEffect(() => {
        fetchMarket()
    }, [params.id, coupon])

    if(isLoading){
        return <Loading/>
    }

    if(!data){
        return <Redirect href="/home" />
    }

    return(
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <Cover uri={data?.cover}/>
                <Details data={data}/>
                {coupon && <Coupon code={coupon}/>}
            </ScrollView>

            <View style={{ padding: 32 }}>
                <Button onPress={() => handleOpenCamera()}>
                    <Button.Title>Ler QR Code</Button.Title>
                </Button>
            </View>

            <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
                <CameraView style={{ flex: 1 }} facing="back" onBarcodeScanned={({ data }) => {
                    if(data && !qrLock.current){
                        qrLock.current = true
                        setTimeout(() => handleUseCoupon(data), 500)
                    }
                }}/>

                <View style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
                     <Button onPress={() => setIsVisibleCameraModal(false)} isLoading={couponIsFetching}>
                        <Button.Title>Voltar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}