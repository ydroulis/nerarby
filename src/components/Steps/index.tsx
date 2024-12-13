import { View, Text } from "react-native";
import { QrCode, MapPin, Ticket } from 'lucide-react-native';

import { s } from './styles'
import { Step } from "../Step";

export function Steps(){
    return(
        <View style={s.container}>
            <Text style={s.title}>Veja como funciona: </Text>

            <Step icon={MapPin} title='Encontre estabelecimentos' description='Veja locais perto de você que são parceiros Nearby'/>
            <Step icon={QrCode} title='Ative o cupom com QR Code' description='Escaneie o código no estabelecimento para usar o benefício'/>
            <Step icon={Ticket} title='Garanta vantagens perto de você' description='Ative cupons onde estiver, em diferentes tipos de estabelecimento'/>
        </View>
    )
}