import React from "react";
import { 
    TouchableOpacity, 
    Text, 
    TouchableOpacityProps, 
    TextProps, 
    ActivityIndicator 
} from "react-native";
import { colors } from '@/styles/theme'
import { LucideProps } from 'lucide-react-native'

import { s } from './styles';


type ButtonProps = TouchableOpacityProps & {
    isLoading?: boolean;
}

type IconProps = {
    icon: React.ComponentType<LucideProps>
}


function Button({ children, style, isLoading = false, ...rest }: ButtonProps){
    return(
        <TouchableOpacity activeOpacity={0.5} style={[s.container, style]} disabled={isLoading} {...rest}>
            { isLoading ? <ActivityIndicator size='small' color={colors.gray[100]}/> : children }
        </TouchableOpacity>
    )
}

function Title({ children }: TextProps){
    return(
        <Text style={s.title}>{children}</Text>
    )
}

function Icon({ icon: Icon }: IconProps){
    return(
        <Icon size={24} color={colors.gray[100]}/>
    )
}


Button.Title = Title
Button.Icon = Icon

export { Button }