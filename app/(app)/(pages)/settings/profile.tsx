import DefaultProfile from "@/src/components/UI/DefaultProfile";
import { PURPLE } from "@/src/constants";
import { Button } from "@rneui/themed";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { supabase } from "@/src/lib/supabase";
import { useSession } from "@/context/SessionProvider";
import {decode} from "base64-arraybuffer";
import ComopanyLogo from "@/src/components/UI/CompanyLogo";

export default function Profile () {

    const {session} = useSession();

    const [avatarUri, setAvatarUri] = useState<string | null>(null)
    const [companyLogo, setCompanyLogo] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [profile, setProfile] = useState()

    useEffect(() => {
        if(session){
            getProfile()
            getCompanyLogo()
            console.log(profile)
        }
    }, [])

    async function getProfile() {
        try{
            setUploading(true)
            if (!session?.user) throw new Error("No user on the session!")

            // const roleCheck = await supabase.rpc("has_role", {
            //     p_company: session.user?.user_metadata?.company_id,
            //     p_roles: ['admin', 'manager']
            // })

            // console.log('RPC role check: ', roleCheck)
            
            const {data: profile_data, error: profile_error} = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session?.user?.id)
                .single()
            

            if(profile_error) throw(profile_error);

            setProfile(profile_data)

            if(!profile_data?.avatar_url){
                return;
            }

            const {data: download} = supabase.storage
                .from('avatars')
                .getPublicUrl(profile_data?.avatar_url)

            
            setAvatarUri(download.publicUrl + `?t=${Date.now()}`)
        } catch(error){
            if (error instanceof Error){
                Alert.alert(error.message);
            }

        } finally{
            setUploading(false)
        }
    }


    async function getCompanyLogo(){
        try{
            setUploading(true)
            if(!session?.user) throw new Error('No user on the session!');

            const {data, error} = await  supabase
                .from('company')
                .select('company_logo_url')
                .eq('company_id', session.user.user_metadata?.company_id)
                .single()

            if(error) throw error

            if(data){
                // setCompanyLogo(data.company_logo_url)
                // console.log('Company Logo: ', companyLogo)
                const {data: download} = supabase.storage
                    .from('company_logos')
                    .getPublicUrl(data.company_logo_url)

                setCompanyLogo(download.publicUrl)
                console.log('Company Logo: ', companyLogo)

            }

            if(!data.company_logo_url) return;

            //Download

        } catch(error){
            if(error instanceof Error){
                console.log('Error getting company logo: ', error.message)
                Alert.alert(error.message)
            }

        } finally{
            setUploading(false)
        }
    }



    async function uploadAvatar(){
        try{
            if (!session?.user) throw new Error("No user on the session!")

            setUploading(true)

            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if(!permissionResult.granted){
                Alert.alert('Permission required', 'Permission to access the media library is required.');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                //Default mediaType is images
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            })

            // console.log(result)

            if(!result.canceled){
                const image = result.assets[0]
                const fileExt = image.fileName?.split('.').pop()?.toLowerCase() ?? 'jpeg'



                const filePath = `${session?.user?.id as string}/avatar`

                if(!image.base64){
                    throw new Error("Could not upload image.")
                }

                // const photo = {
                //     uri: image.uri,
                //     type: 
                //     name: image.fileName || `${session?.user?.id}`
                // }

                const type = image.mimeType?.toLowerCase() || 'image/jpeg'
                

                let {data : bucket_file, error: upload_error} = await supabase.storage
                    .from('avatars')
                    .upload(filePath, decode(image.base64), {
                        contentType: type, 
                        upsert: true
                    })

                if(upload_error){
                    console.log(upload_error)
                    throw upload_error
                } 

                if(!bucket_file?.path){
                    throw new Error("Could not upload image.")
                }

                const {data: profile, error: profile_error} = await supabase
                    .from("profiles")
                    .select("avatar_url")
                    .eq('user_id', session?.user?.id)
                    .single()

                if(profile_error){
                    throw(profile_error)
                }

                console.log(bucket_file?.path)

                //First time avatar upload
                if(!profile?.avatar_url){
                    const {error: update_error} = await supabase
                        .from("profiles")
                        .update({
                            avatar_url: bucket_file?.path,
                            updated_at: new Date(),
                        })
                        .eq('user_id', session?.user?.id)

                    if(update_error){
                        throw(update_error)
                    }
                }

                const { error: tsError } = await supabase
                    .from("profiles")
                    .update({
                    updated_at: new Date()
                    })
                    .eq("user_id", session?.user?.id);

                if(tsError){
                    throw tsError
                };

                const {data: download} = supabase.storage
                    .from('avatars')
                    .getPublicUrl(bucket_file.path)
            
                setAvatarUri(download.publicUrl + `?t=${Date.now()}`)
                console.log(avatarUri)

            }
        } catch(error){
            if (error instanceof Error){
                Alert.alert(error.message)
            }
        } finally {
            setUploading(false)
        }
    }


    async function uploadCompanyLogo() {
        try{
            if (!session?.user) throw new Error("No user on the session!")
            setUploading(true)

            const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

            if(!permissionResult.granted){
                Alert.alert('Permission required', 'Permission to access the media library is required.');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            })

            if(!result.canceled){
                const image = result.assets[0]
                // const fileExt = image.fileName?.split('.').pop()?.toLowerCase() ?? 'jpeg'

                const filePath = `companies/${session?.user?.user_metadata?.company_id}/logo`

                if(!image.base64){
                    throw new Error("Could not upload image.")
                }

                const type = image.mimeType?.toLowerCase() || 'image/jpeg'


                //Check for existing company logo url
                const {data: company, error: company_error} = await supabase
                    .from('company')
                    .select(`company_logo_url, name`)
                    .eq('company_id', session?.user?.user_metadata?.company_id)
                    .single()

                if(company_error) throw company_error


                console.log('Company: ', company)



                let {data: bucket_file, error: upload_error} = await supabase.storage
                    .from('company_logos')
                    .upload(filePath, decode(image.base64), {
                        contentType: type,
                        upsert: true,
                    })


                if(upload_error){
                    console.log(upload_error)
                    throw upload_error
                }

                if(!bucket_file?.path){
                    throw new Error("Could not upload image.")
                }

                console.log('Bucket file path: ', bucket_file.path)

                

                console.log('First time logo upload?: ', company.company_logo_url)
                //First time company logo upload
                if(!company.company_logo_url){
                    console.log('Company Id: ', session?.user?.user_metadata?.company_id)
                    const {data: update_data, error: update_error} = await supabase
                        .from('company')
                        .update({
                            company_logo_url: bucket_file.path,
                            updated_at: new Date(),
                        })
                        .eq('company_id', session?.user?.user_metadata?.company_id)
                        .select()
                    
                    if(update_error){
                        console.log(update_error)
                        throw update_error
                    }

                    console.log('Update data: ', update_data)
                } else{
                    const { error: tsError } = await supabase
                        .from('company')
                        .update({
                        updated_at: new Date()
                        })
                        .eq('company_id', session?.user?.user_metadata?.company_id);
                    
                    if(tsError) throw tsError
                }

                const {data: download} = supabase.storage
                    .from('company_logos')
                    .getPublicUrl(bucket_file.path)

                console.log(download.publicUrl)
                setCompanyLogo(download.publicUrl + `?t=${Date.now()}`)
                console.log('Company Logo: ', companyLogo)
            }

        } catch(error){
            if (error instanceof Error){
                console.log('Error uploading company logo: ', error.message)
                Alert.alert('Error uploading company logo: ', error.message)
            }
        } finally{
            setUploading(false)
        }
    }

    //Create custom hooks for image uploads and downloads.

    return (        
        <View style={{flex: 1, alignItems: 'center'}}>
            {
                uploading ? <ActivityIndicator style={{flex: 1, justifyContent: 'center'}}/> :
                <>
                    <View style={styles.imageContainer}>
                        <DefaultProfile url={avatarUri || ''}/>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title='Change profile picture'
                            onPress={() => {uploadAvatar()}}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                        />
                    </View>

                    <View style={styles.imageContainer}>
                        {/* <Text style={{textAlign: 'center', fontSize: 20}}>COMPANY LOGO</Text> */}
                        <ComopanyLogo url={companyLogo || ''}/>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title='Change company logo'
                            onPress={() => {uploadCompanyLogo()}}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                        />
                    </View>
                </>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        alignItems: 'center',
    },

    buttonContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        // borderColor: 'black'
    },

    button: {
        backgroundColor: PURPLE[200],
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginBottom: 18,
        width: '100%',
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0b0613ff",
        marginTop: 6,
    },
})