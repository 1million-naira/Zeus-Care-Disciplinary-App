import { Text } from "@rneui/themed";
import { use, useCallback, useRef, useState } from "react";
import { FlatList, Modal, Platform, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { OptionItem } from "@/src/Types/Types";
import { PURPLE } from "@/src/constants";
import CustomText from "./CustomText";
import { COLORS } from "@/src/colors";



interface DropDownProps {
    data: OptionItem[];
    onChange?: (item: any) => void;
    placeholder?: string;
    // showToggle? : boolean;
    expanded? : boolean;
    changeExpanded? : (expanded: boolean) => void;

}

export default function ListDisplay({
    data,
    onChange,
    placeholder,
    expanded,
    changeExpanded

    } : DropDownProps) {

        // const [expanded, setExpanded] = useState(() => showToggle ? false : true);



        // const toggleExpanded = useCallback(() => {
        //     setExpanded(!expanded);
        // }, [])

        const [value, setValue] = useState<string>("")

        const buttonRef = useRef<View>(null);

        const [top, setTop] = useState(0);

        const onSelect = useCallback((item: OptionItem) => {
            onChange?.(item);
            setValue(item.label);
            // setExpanded(false);
            changeExpanded?.(false)
        }, []);


        return (
            <View
                ref={buttonRef}
            >
                {
                    expanded ? (
                        <TouchableWithoutFeedback onPress={() => {changeExpanded?.(false)}}>
                            <View style={styles.backdrop}>
                                <View
                                    style={[
                                        styles.options,
                                    ]}
                                >
                                    <FlatList
                                        contentContainerStyle={{borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 8}}
                                        data={data}
                                        renderItem={({item}) => (
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                style={styles.optionItem}
                                                onPress={() => onSelect(item)}
                                            >
                                                <CustomText type="caption">{item.label}</CustomText>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={item => item.value}
                                        scrollEnabled={false}
                                        ItemSeparatorComponent={() => <View style={styles.separator} /> }
                                        refreshing
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    ) : null
                }
            </View>
        )

}


const styles = StyleSheet.create({

    backdrop: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        // borderWidth: 1,
    },

    separator: {
        height: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.inputBorder,
        width: "100%",
        marginHorizontal: "auto",
    }, 

    optionItem: {
        height: 40,
        justifyContent: "center",
        // backgroundColor: PURPLE[100],
        // backgroundColor: "#fffcfeff",
        paddingHorizontal: 10,
    },

    text: {
        fontSize: 15,
        opacity: 0.8,
    },

    options: {
        // position: "absolute",
        // top: 53,
        // backgroundColor: COLORS.inputBackground,
        width: "100%",
        paddingVertical: 6,
        paddingHorizontal: 5,
        borderRadius: 6,
        maxHeight: 250,
        // shadowColor: "#cdc8ceff",
        // shadowOffset: {width: 3, height: 5},
        // shadowOpacity: 0.2,
        // shadowRadius: 10,
    },
})