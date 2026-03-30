import { COLORS } from "@/src/colors";
import CardContainer from "@/src/components/UI/Containers/CardContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomInput from "@/src/components/UI/CustomInput";
import CustomText from "@/src/components/UI/CustomText";
import Pagination from "@/src/components/UI/Pagination";
import Spacer from "@/src/components/UI/Spacer";
import { INCIDENT_STATUS_LABELS } from "@/src/constants";
import throttle from "@/src/helpers/throttle";
import { Incident, IncidentStatus } from "@/src/Types/Types";
import { AntDesign, FontAwesome, FontAwesome6, SimpleLineIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { FlatList, TouchableOpacity } from "react-native";
import { Modal, StyleSheet, View } from "react-native";


type Props = {
    getData?: (searchText : string, status: IncidentStatus, page: number) => Promise<Incident[] | undefined>,
    getCount?: (searchText : string, status: IncidentStatus) => Promise<number | undefined>,
}


export default function IncidentList ({
    getCount,
    getData,
}: Props){

    const [data, setData] = useState<Incident[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>("")

    const [filter, setFilter] = useState<'reported' | 'in_review' | 'in_investigation' | 'closed' | null>(null)
    const [sortBy, setSortBy] = useState<'date'|'title'|null>(null);
    const [count, setCount] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [searchSize, setSearchSize] = useState<number>(10)

    const [searchUser, setSearchUser] = useState<boolean>(false)
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false)


    const getIncidentCount = useCallback(async () => {
        try{
            setLoading(true);
            const result = await getCount?.(searchText, filter);
            if(!result){
                throw new Error('Unable to get incident count.')        
            }
            console.log(result);
            setCount(result);

        } catch(err : any){
            console.log(err)
        } finally{
            setLoading(false);
        }
    }, [searchText, filter])


    const getIncidents = useCallback (async () => {
        try{
            setLoading(true);
            const result = await getData?.(searchText, filter, page);
            if(!result){
                throw new Error('Unable to get incidents.')        
            }
            console.log(result);
            setData(result);

        } catch(err : any){
            console.log(err)
        } finally{
            setLoading(false);
        }     
    }, [searchText, filter, page])


    useEffect(() => {
        getIncidentCount();
        getIncidents();
    }, []);

    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {console.log("Search for new data"); getIncidentCount(); getIncidents();}, 500)

    //     return () => {clearTimeout(timeoutId)};
    // }, [searchText, filter, page])

    const applyFilters = useCallback(async () => {
        try{
            setLoading(true)
            await getIncidentCount();
            await getIncidents();
            setShowFilterModal(false);
        } catch (err: any){ 
            console.log(err);
            Alert.alert('Unable to fetch incidents');
        } finally{
            setLoading(false)
        }
    }, [getIncidentCount, getIncidents])


    const throttleApplyFilters = useMemo(() => throttle(applyFilters), [applyFilters])

    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <CustomButton
                    title='Filter'
                    color={COLORS.buttonSecondary}
                    icon={<FontAwesome name="filter" color={COLORS.buttonText}/>}
                    onPress={() => setShowFilterModal(true)}
                    size="sm"
                    
                />

                <CustomButton
                    title='Clear filters'
                    color={COLORS.buttonSecondary}
                    icon={<FontAwesome6 name="filter-circle-xmark" color={COLORS.buttonText}/>}
                    onPress={() => {}}
                    size="sm"
                />
                
                {
                    showFilterModal ? (
                        <Modal transparent={true} animationType="slide" visible={showFilterModal}>
                            {/* <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
                                <View style={styles.backdrop}>
                                </View>
                            </TouchableWithoutFeedback> */}
                            
                            <View style={styles.modalFilterContent}>
                                <TouchableOpacity style={{position: 'absolute', top: '8%', left: '90%', zIndex: 999}} onPress={() => setShowFilterModal(false)}>
                                    <AntDesign name="close" size={24}/>
                                </TouchableOpacity>
                                
                                <View style={{paddingHorizontal: 16, paddingVertical: 12, width: '100%', marginTop: 36}}>
                                    <CustomInput
                                        value={searchText}
                                        onChangeText={(text : string) => setSearchText?.(text)}
                                        placeholder="Search incident title"
                                        label="Search the title of an incident"
                                        icon={<FontAwesome name="search" size={12} color={COLORS.text1}/>}
                                        secureTextEntry={false}
                                        // width={'100%'}
                                        size="sm"
                                        
                                    />

                                    <View style={{marginTop: 24}}>
                                        <CustomText type='subheading'>Incident status</CustomText>

                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8, marginTop: 12}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter(null)}>
                                                {
                                                    filter === null ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>All</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('reported')}>
                                                {
                                                    filter === 'reported' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Reported</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('in_review')}>
                                                {
                                                    filter === 'in_review' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>In Review</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('in_investigation')}>
                                                {
                                                    filter === 'in_investigation' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>In Investigation</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('closed')}>
                                                {
                                                    filter === 'closed' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Closed</CustomText>
                                        </View>

                                    </View>
                                    <View style={{marginTop: 24}}>
                                        <CustomText type='subheading'>Sort By</CustomText>

                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8, marginTop: 12}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setSortBy(null)}>
                                                {
                                                    sortBy === null ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>None</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setSortBy('title')}>
                                                {
                                                    sortBy === 'title' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Title</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setSortBy('date')}>
                                                {
                                                    sortBy === 'date' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Date Created</CustomText>
                                        </View>
                                    </View>
                                    <View style={{alignItems: 'center', marginTop: 64}}>
                                        <CustomButton title="Apply filters" color={COLORS.buttonSecondary} size="lg" onPress={() => throttleApplyFilters()}/>
                                    </View>
                                </View>


                            </View>

                        </Modal>
                    ) : null
                }
            </View>

            
            <Spacer height={4}/>
            {/* <View style={{display: 'flex', flexDirection: 'row', gap: 4, justifyContent: 'center'}}>
                <CustomButton
                    title='All'
                    color={filter === null ? COLORS.buttonPrimary : COLORS.inputBackground}
                    textColor={filter !== null ? COLORS.text2 : COLORS.buttonText}
                    onPress={() => {setFilter?.(null)}}
                    size="sm"
                />
                <CustomButton
                    title='Reported'
                    color={filter === 'reported' ? COLORS.buttonPrimary : COLORS.inputBackground}
                    textColor={filter !== 'reported' ? COLORS.text2 : COLORS.buttonText}
                    onPress={() => {setFilter?.('reported')}}
                    size="sm"
                />
                <CustomButton
                    title='Review'
                    color={filter === 'in_review' ? COLORS.buttonPrimary : COLORS.inputBackground}
                    textColor={filter !== 'in_review' ? COLORS.text2 : COLORS.buttonText}
                    onPress={() => {setFilter?.('in_review')}}
                    size="sm"
                />
                <CustomButton
                    title='Investigate'
                    color={filter === 'in_investigation' ? COLORS.buttonPrimary : COLORS.inputBackground}
                    textColor={filter !== 'in_investigation' ? COLORS.text2 : COLORS.buttonText}
                    onPress={() => {setFilter?.('in_investigation')}}
                    size="sm"
                />
                <CustomButton
                    title='Closed'
                    color={filter === 'closed' ? COLORS.buttonPrimary : COLORS.inputBackground}
                    textColor={filter !== 'closed' ? COLORS.text2 : COLORS.buttonText}
                    onPress={() => {setFilter?.('closed')}}
                    size="sm"
                />
            </View> */}

            <Spacer height={24}/>
            <View style={styles.list}>
                <FlatList
                    data={data}
                    style={{
                        // borderWidth: 1, 
                        width: '100%'
                    }}
                    contentContainerStyle={{padding: 10}}
                    ListEmptyComponent={<CustomText type='caption'>No incidents found</CustomText>}
                    renderItem={({item}) => (
                        <CardContainer 
                            style={{padding: 12, backgroundColor: 'transparent', width: '100%'}}       
                        >
                            <View>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <CustomText type="body" style={{fontWeight: 300}}>{item.title}</CustomText>

                                    <TouchableOpacity>
                                        <SimpleLineIcons name="options-vertical" color={COLORS.text3}/>    
                                    </TouchableOpacity>
                                </View>

                                <Spacer height={8}/>
                                <CustomText type="caption" numberOfLines={2} style={{fontSize: 11}}>{item.description}</CustomText>

                                <Spacer height={16}/>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24}}>
                                        <CustomText type="caption">Status</CustomText>
                                        <CustomText type="caption">{INCIDENT_STATUS_LABELS[item.status as 'reported' | 'in_review' | 'in_investigation' | 'closed'] || 'N/A'}</CustomText>
                                    </View>
                                    <View>
                                        <CustomText type="caption">{item.occured_at ? new Date(item.occured_at).toDateString() : 'N/A'}</CustomText>
                                    </View>
                                </View>
                            </View>

                        </CardContainer>
                    )}
                    ItemSeparatorComponent={() => 
                        // <View style={{borderColor: '#e9e4e4ff', borderBottomWidth: 1, width: '100%',}}></View>
                        <Spacer height={12}/>
                    }
                />
                <Pagination 
                total={count}
                updatePage={setPage}
                currentPage={page}
                />
            </View>


        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'flex-end',
        flexDirection: 'row',
        marginTop: 15,
        paddingTop: 10,
        gap: 12,
        // borderWidth: 1,     
    },

    backdrop: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },

    modalFilterContent: {
        marginHorizontal: 'auto',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.background,
        gap: 10,
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 45,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
    },

    list: {
        width: '100%',
        alignItems: 'center',
        flex: 1,
    },

    listItem: {
        minHeight: 30,
        width: 300,
        backgroundColor: COLORS.favourite,
        borderRadius: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        // borderWidth: 0.2,
        // borderColor: '#522754ff',
    },
})