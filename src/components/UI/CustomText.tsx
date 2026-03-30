import { COLORS } from "@/src/colors"
import { StyleSheet, Text, TextStyle, TouchableOpacity } from "react-native"


type TextType = 'heading' | 'subheading' | 'body' | 'caption' | 'button'

type Props = {
    children?: React.ReactNode,
    type?: TextType,
    style?: TextStyle | TextStyle[],
    numberOfLines?: number,
    onPress?: () => void,
    props? : {},
}


export default function CustomText({children, type='body', style, onPress = () => {}, numberOfLines, ...props} : Props) {

    const textStyles = {
        heading: styles.heading,
        caption: styles.caption,
        body: styles.body,
        subheading: styles.subheading,
        button: styles.button,
    }

    return (
        // <TouchableOpacity onPress={onPress} activeOpacity={1}>
        //     <Text style={[textStyles[type], style]} numberOfLines={numberOfLines} {...props}>
        //         {children}
        //     </Text>
        // </TouchableOpacity>
        <Text style={[textStyles[type], style]} numberOfLines={numberOfLines} {...props}>
          {children}
        </Text>
    )

}


const styles = StyleSheet.create({
    heading: {
      color: COLORS.text1,
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '400',
      letterSpacing: 0.4,
    }, 

    body: {
      color: COLORS.text1,
      fontSize: 16,
      lineHeight: 32,
      fontWeight: '300',
      letterSpacing: 0.2,
    }, 

    caption: {
      color: COLORS.text1,
      fontSize: 12,
      lineHeight: 24,
      fontWeight: '200',
      letterSpacing: 0.2,
      fontStyle: 'italic',
    },

    button: {
      color: COLORS.text1,
      fontSize: 14,
      lineHeight: 24,
      fontWeight: '200',
      letterSpacing: 0.2,
      fontStyle: 'italic',
    },

    subheading: {
      color: COLORS.text1,
      fontSize: 20,
      lineHeight: 36,
      fontWeight: '300',
      letterSpacing: 0.4,
    }
})