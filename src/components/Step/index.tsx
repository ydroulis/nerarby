import { Text, View } from "react-native";
import { colors } from '@/styles/theme';

import { s } from './styles';

export function Step(){
    return(
        <View style={s.container}>
            <Text style={s.title}>
                Título
            </Text>
            <Text style={s.description}>
                Descrição ...
            </Text>
        </View>
    )
}