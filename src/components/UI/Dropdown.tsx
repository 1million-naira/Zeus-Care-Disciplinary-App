import { Text } from "@rneui/themed";
import { use, useCallback, useRef, useState } from "react";
import { FlatList, Modal, Platform, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { OptionItem } from "@/src/Types/Types";
import { COLORS } from "@/src/colors";
import CustomText from "./CustomText";
import CustomButton from "./CustomButton";



interface DropDownProps {
    data: OptionItem[];
    onChange?: (item: any) => void;
    placeholder?: string;
    renderItem? : (item : any) => React.ReactNode
    width?: number,
    // showToggle? : boolean;
    // expanded? : boolean;

    // changeExpanded? : (expanded: boolean) => void;

}

export default function Dropdown({
    data,
    onChange,
    placeholder,
    renderItem,
    width

    } : DropDownProps) {

        const [expanded, setExpanded] = useState(false);

        const [buttonWidth, setButtonWidth] = useState<number | null>(null);
        const [buttonY, setButtonY] = useState<number | null>(null);

        const toggleExpanded = useCallback(() => {
            setExpanded(!expanded);
        }, [expanded])

        const [value, setValue] = useState<string>("")

        const buttonRef = useRef<View>(null);

        const [top, setTop] = useState(0);

        const onSelect = useCallback((item: OptionItem) => {
            onChange?.(item.value);
            setValue(item.label);
            setExpanded(false);
        }, []);


        return (
            <View
                ref={buttonRef}
                // onLayout={(event) => {
                //     const layout = event.nativeEvent.layout;
                //     const topOffset = layout.y;
                //     const heightOfComponent = layout.height;

                //     const finalValue = 
                //         topOffset + heightOfComponent + (Platform.OS === "android" ? -32 : 3);

                //     setTop(finalValue);
                // }}  
            >

                
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.button]}
                    onPress={toggleExpanded}
                    onLayout={(e) => {
                        setButtonWidth(e.nativeEvent.layout.width);
                        setButtonY(e.nativeEvent.layout.y)
                    }}
                >
                    <CustomText type="button" style={{fontSize: 10, fontWeight: 300, color: COLORS.text2}}>{value || placeholder}</CustomText>
                    <AntDesign name={expanded ? "caret-up" : "caret-down"} color={COLORS.text2}/>
                </TouchableOpacity>

                

                {
                    expanded ? (
                        <View>
                            <Modal animationType="slide" transparent={true} visible={expanded}>
                                <TouchableWithoutFeedback onPress={() => toggleExpanded()}>
                                    <View style={styles.backdrop}>
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    <ScrollView>
                                    {
                                    data.map((d, index) => (
                                        <View key={d.value} style={styles.optionItem}>
                                            <TouchableOpacity onPress={() => onSelect(d)}>
                                                {/* <Text style={styles.optionText}>{d.label}</Text> */}
                                                <CustomText type="caption" style={{textAlign: "center"}}>{d.label}</CustomText>
                                            </TouchableOpacity>
                                            <View style={styles.separator}/>
                                        </View>
                                    ))  
                                    }
                                    </ScrollView>
                                </View>
                            </Modal>
                        </View>
                    ) : null
                }
            </View>
        )

}


const styles = StyleSheet.create({

    backdrop: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        // width: 100,
    },

    modalContent: {
        height: '35%',
        width: '100%',
        backgroundColor: COLORS.inputBackground,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
        paddingTop: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    separator: {
        // height: 4
        height: 1,
        backgroundColor: "rgba(90,70,217,0.08)",
        marginVertical: 4,
        // marginHorizontal: 6
    }, 

    optionItem: {
        // height: 40,
        // justifyContent: "center",
        minHeight: 44,
        justifyContent: "center",
        paddingHorizontal: 12,
        borderRadius: 8,
        marginVertical: 1,
    },

    text: {
        // fontSize: 15,
        // opacity: 0.8,
        fontSize: 12,
        opacity: 0.95,
        color: "#5A46D9",
        width: '70%',
        // padding: 1,
        // borderWidth: 1,
        // borderColor: "#000000ff",
        // textAlign: 'center',
    },

    // options: {
    //     position: "absolute",
    //     // top: 53,
    //     backgroundColor: "white",
    //     width: "100%",
    //     padding: 10,
    //     borderRadius: 6,
    //     maxHeight: 250,
    // },

    button: {
        height: 40,
        justifyContent: "space-between",
        backgroundColor: 'transparent',
        flexDirection: "row",
        // width: "50%",
        alignItems: "center",
        paddingHorizontal: 10,
        borderRadius: 8,
        minWidth: '50%',
        // maxWidth: '50%',
        borderBottomWidth: 0.5,
        borderColor: COLORS.main,
        // shadowColor: "#2f2f31ff",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.06,
        // shadowRadius: 6,
        // elevation: 2,
    },

    optionsContainer: {
        width: '100%',
        backgroundColor: "#F2EFFF",
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,

        // shadow / elevation
        shadowColor: "#7B61FF",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 24,
        elevation: 8,
        // thin purple border accent
        borderWidth: 1,
        borderColor: "#000000ff",
        maxHeight: 250,
    },

    optionText: {
        fontSize: 15,
        color: "#241E3A",
        opacity: 0.95,
        textAlign: 'center',
    },

})