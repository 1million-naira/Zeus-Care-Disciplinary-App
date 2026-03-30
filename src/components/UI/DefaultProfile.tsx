import { useEffect } from "react";
import { Image, ImageStyle, StyleSheet, Text, View } from "react-native";


type Props = {
    url: String,
    size?: number,
    onUpload? : () => void,
    style?: ImageStyle,
}

export default function DefaultProfile ({url, size = 150, onUpload, style} : Props) {

    const avatarSize = {height: size, width: size}

    // useEffect(() => {
    //     if(url) downloadImage(url)
    // }, [url])

    // async function downloadImage(path: String){
    // }

    const path = url.length === 0 || !url ? require('@/assets/images/default-profile2.png') :
    {uri : url, cache: 'reload'}

    return (
        <View style={[]}>
            <Image source={path} style={[{width: size, height: size}, styles.avatar]}/>
        </View>
    )

}


const styles = StyleSheet.create({


    avatar: {
        borderRadius: 100,
        overflow: 'hidden',
        maxWidth: '100%'
    },
    image: {
        objectFit: 'cover',
        paddingTop: 0,
    },
    noImage: {
        position: 'relative',
        backgroundColor: '#dbccccff',
        // borderWidth: 10,
        borderColor: 'rgb(200, 200, 200)',
        borderRadius: 100
    },
})