import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState, Image, TouchableOpacity } from "react-native";
import { supabase } from "@/src/lib/supabase";
import { Button, Input } from "@rneui/themed"
import { useRouter } from "expo-router";
import MainContainer from "@/src/components/UI/Containers/MainContainer";
import CustomInput from "@/src/components/UI/CustomInput";
import CustomText from "@/src/components/UI/CustomText";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import CustomButton from "@/src/components/UI/CustomButton";
import { COLORS } from "@/src/colors";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {Alert.alert(error.message)}
    setLoading(false)
    
    router.replace('/');
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (error) {Alert.alert(error.message)}
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <MainContainer>
      <View style={{alignItems: 'center', opacity: 0.7, marginTop: 30}}>
        <Image source={require('@/assets/images/logos/logo-horizontal-transparent-bw.png')}
        style={{width: '50%', height: 30}}
        />
      </View>
      <CustomText type='heading'>Login</CustomText>

      <CustomInput
        label="Email"
        placeholder="email@address.com"
        value={email}
        onChangeText={(text) => setEmail(text)}
        icon={<Ionicons name="mail-outline" size={18}/>}
        autoCapitalise="none"
      />

      <CustomInput
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        icon={<Ionicons name="lock-closed-outline" size={18}/>}
        secureTextEntry={true}
        autoCapitalise="none"
      />



      <View style={{marginTop: 20}}>
        <CustomButton
        title="Log In"
        disabled={loading}
        onPress={() => signInWithEmail()}
        />
      </View>

      <View style={{width: '100%', marginTop: 12, paddingHorizontal: 6, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4}}>
        <View style={{borderBottomWidth: 1, borderColor: COLORS.inputBorder, width: '350%'}}></View>
        <CustomText style={{fontSize: 13, fontWeight: 200}}>or continue with</CustomText>
        <View style={{borderBottomWidth: 1, borderColor: COLORS.inputBorder, width: '350%'}}></View>
      </View>

      <View style={{marginTop: 20}}>
        <CustomButton
          title="Continue with Google"
          disabled={loading}
          icon={<FontAwesome name='google' color={COLORS.buttonText} size={18}/>}
        />
      </View>

      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent:'center', gap: 3, marginTop: 20, flexWrap: 'wrap'}}>
        <CustomText style={{fontWeight: 200, fontSize: 16}}>Don't have an account yet?</CustomText>
        <TouchableOpacity>
          <CustomText style={{color: COLORS.buttonSecondary, fontWeight: 400, fontSize: 16}}>Sign up</CustomText>
        </TouchableOpacity>
      </View>

      <View style={{width: '100%', marginTop: 12, paddingHorizontal: 6, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4}}>
        <View style={{borderBottomWidth: 1, borderColor: COLORS.inputBorder, width: '35%'}}></View>
        <CustomText style={{fontSize: 13, fontWeight: 200}}>or</CustomText>
        <View style={{borderBottomWidth: 1, borderColor: COLORS.inputBorder, width: '35%'}}></View>
      </View>

      <View style={{display: 'flex', flexDirection: 'row', justifyContent:'center', alignItems: 'center', gap: 3, marginTop: 12, flexWrap: 'wrap'}}>
        <CustomText style={{fontWeight: 200, fontSize: 16}}>Are you a care provider manager?</CustomText>
        <TouchableOpacity onPress={() => router.push('/auth/country-selection')}>
          <CustomText style={{color: COLORS.buttonSecondary, fontWeight: 400, fontSize: 16}}>Register your company</CustomText>
        </TouchableOpacity>
      </View>
    </MainContainer>

  )
}


const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },

  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch'
  },

  mt20: {
    marginTop: 20,
  }
})