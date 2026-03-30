import { COLORS } from "@/src/colors";
import CardContainer from "@/src/components/UI/Containers/CardContainer";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomText from "@/src/components/UI/CustomText";
import { PURPLE } from "@/src/constants";
import { files } from "@/src/data";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Files() {
    const router = useRouter()

    useEffect(() => {

    }, [])

    async function getFiles (){

    }

    const icons = {
        'PDF': <AntDesign name="file-pdf" size={16} color={COLORS.buttonSecondary} style={{opacity: 0.7}}/>,
        'DOCX': <AntDesign name="file-word" size={16} color={COLORS.buttonSecondary} style={{opacity: 0.7}}/>,
        'IMAGE': <AntDesign name="file-image" size={16} color={COLORS.buttonSecondary} style={{opacity: 0.7}}/>,
        'VIDEO': <AntDesign name="video-camera" size={16} color={COLORS.buttonSecondary} style={{opacity: 0.7}}/>
    }

    const fileTypeLabels = {
        'PDF': 'PDF',
        'DOCX': 'Word',
        'IMAGE': 'Image',
        'VIDEO': 'Video',
    }

    return (
        <MainContainer>

            {/* <CustomText type='subheading' style={{marginHorizontal: 'auto'}}>Documents</CustomText> */}
            {/* <Text>Documents</Text> */}
            <View style={styles.listContainer}>
                <FlatList
                style={{flex: 1, padding: 12}}
                    data={files}
                    renderItem={({item}) => 
                        <CardContainer style={styles.fileCard} activeOpacity={0.7} onPress={() => console.log("File clicked to view")}>
                            <View style={styles.iconContainer}>
                                {icons[item.type]}
                            </View>
                            <View style={styles.fileInfo}>
                                <CustomText numberOfLines={1} style={{fontSize: 14}}>{item.name}</CustomText>
                                <CustomText type='caption'>Type: {fileTypeLabels[item.type]}</CustomText>
                                {/* <CustomText type='caption'>Size: {item.size}</CustomText> */}
                                <CustomText type='caption'>Created on {item.created.toDateString()}</CustomText>
                            </View>
                        </CardContainer>
                    }
                />
            </View>

        </MainContainer>
    )
}



const styles = StyleSheet.create({

    listContainer: {
        flex: 1,
        // borderWidth: 1,
    }, 

    fileCard: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 16,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 16,
        marginTop: 10,
        minHeight: 100,
    },

    iconContainer: {
        backgroundColor: COLORS.lightPurple, 
        borderRadius: 50, 
        padding: 12, 
        alignItems: 'center', 
        justifyContent: 'center'
    },

    fileInfo: {
        display: 'flex',
        flexDirection: 'column',
        width: '55%',
        gap: 6,
    }, 
})