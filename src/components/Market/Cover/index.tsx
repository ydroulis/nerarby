import { ImageBackground, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";

import { router } from "expo-router";

import { s } from './styles';
import { Button } from "@/components/Button";

type Props = {
    uri: string
}

export function Cover({ uri }: Props){
    return(
        <ImageBackground source={{uri}} style={s.container}>
            <View style={s.header}>
                <Button style={{ width: 40, height: 40}} onPress={() => router.back()}>
                    <Button.Icon icon={ArrowLeft}/>
                </Button>
            </View>
        </ImageBackground>
    )
}