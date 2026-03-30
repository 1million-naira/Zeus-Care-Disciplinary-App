// DateTimeInputNative.tsx
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native";
import { PURPLE } from "@/src/constants";
import Spacer from "./Spacer";
import { COLORS } from "@/src/colors";
import CustomText from "./CustomText";

type Props = {
  value?: Date;
  onChange?: (date: Date) => void;
  /**
   * Optional formatter for the button label.
   * Defaults to `date.toLocaleString()`.
   */
  labelFormatter?: (date: Date) => string;
  minimumDate?: Date;
  maximumDate?: Date;
  minuteInterval?: number;
  label?: string;
};

export default function DateTimeInputNative({
  value = new Date(),
  onChange,
  labelFormatter,
  minimumDate,
  maximumDate,
  minuteInterval,
  label,
}: Props) {
  const [date, setDate] = useState<Date>(value);
  const [show, setShow] = useState<boolean>(false);
  const [mode, setMode] = useState<"date" | "time" | "datetime">("date");
  const [tempDate, setTempDate] = useState<Date>(value); // Android intermediate

  function openPicker() {
    if (Platform.OS === "ios") {
      setMode("datetime");
      setShow(!show);
    } else {
      // Android: start with date picker then time
      setMode("date");
      setShow(!show);
    }
  }

  // Signature: (event, selectedDate?)
  function onPickerChange(_event: any, selected?: Date | undefined) {
    if (Platform.OS === "ios") {
      // iOS keeps the picker visible as a controlled input
      setShow(true);
      if (!selected) return;
      setDate(selected);
      onChange?.(selected);
      return;
    }

    // Android behavior:
    // - If user cancelled, selected will be undefined
    if (!selected) {
      setShow(false);
      return;
    }

    if (mode === "date") {
      // store chosen date and open time picker next
      setTempDate(selected);
      setMode("time");
      setShow(true);
      return;
    }

    // mode === "time": combine date (Y/M/D) from tempDate with picked time (H/M/S)
    if (mode === "time") {
      const pickedTime = selected;
      const combined = new Date(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate(),
        pickedTime.getHours(),
        pickedTime.getMinutes(),
        pickedTime.getSeconds()
      );
      setDate(combined);
      onChange?.(combined);
      setShow(false);
    }
  }

  return (
    <View style={styles.container}>
        {/* <Button
            title={labelFormatter ? labelFormatter(date) : date.toLocaleString()}
            onPress={openPicker}
            color="purple"
        /> */}

        <CustomText style={{fontSize: 14}}>{label}</CustomText>
        <Spacer height={4}/>
        <Pressable
          onPress={openPicker}
          style={({pressed}) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
          ]}
          android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
          accessibilityRole="button"
        >

          <CustomText style={{color: COLORS.buttonText}}>
            {labelFormatter ? labelFormatter(date) : date.toLocaleString()}
          </CustomText>

        </Pressable>

        <Spacer height={10}/>
        
        {show && (
            <DateTimePicker
                value={mode === "time" ? tempDate : date}
                mode={mode}
                display="default"
                onChange={onPickerChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                minuteInterval={minuteInterval}
            />
        )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    // marginVertical: 8,
    marginTop: 8,
  },
  button: {
    backgroundColor: COLORS.buttonSecondary, // base purple (editable)
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',

    // shadow (iOS)
    shadowColor: '#4b494dff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,

    // elevation (Android)
    elevation: 6,
  },
  buttonPressed: {
    // slightly darker / translucent when pressed
    // backgroundColor: PURPLE[500],
    transform: [{ translateY: 1 }],
    shadowOpacity: 0.12,
    elevation: 3,
  },
  buttonText: {
    color: COLORS.text2,
    fontWeight: '600',
    fontSize: 15,
  },
});