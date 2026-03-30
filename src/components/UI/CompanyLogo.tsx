import { PURPLE } from "@/src/constants"
import { Button } from "@rneui/themed"
import { Image, StyleSheet, View } from "react-native"

type Props = {
    url : string,
    size? : number,
    onUpload? : () => void,
    editable? : boolean,
}

// aspect ratio???

// Add companyLogo column to companies table in supabase POSTGRES.

export default function ComopanyLogo({url, size = 150, onUpload, editable = false} : Props) {

    const avatarSize = {height: 30, width: 100}

    const path = url.length === 0 || !url ? require('@/assets/images/default-profile2.png') :
    {uri : url, cache: 'reload'}


    return (
        <View style={styles.avatar}>
            <Image source={path} style={avatarSize}/>
        </View>
    )

}


const styles = StyleSheet.create({

    avatar: {
        // borderRadius: 100,
        overflow: 'hidden',
        maxWidth: '100%'
    },
})