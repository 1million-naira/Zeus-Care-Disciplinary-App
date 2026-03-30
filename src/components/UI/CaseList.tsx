import { COLORS } from "@/src/colors";
import CardContainer from "@/src/components/UI/Containers/CardContainer";
import CustomButton from "@/src/components/UI/CustomButton";
import CustomInput from "@/src/components/UI/CustomInput";
import CustomText from "@/src/components/UI/CustomText";
import Pagination from "@/src/components/UI/Pagination";
import Spacer from "@/src/components/UI/Spacer";
import { STATUS_LABELS } from "@/src/constants";
import throttle from "@/src/helpers/throttle";
import { Case, CaseStatus } from "@/src/Types/Types";
import { AntDesign, FontAwesome, FontAwesome6, SimpleLineIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { Modal, StyleSheet, View } from "react-native";


type Props = {
    getData?: (searchText : string, status: CaseStatus, page: number) => Promise<Case[] | undefined>,
    getCount?: (searchText : string, status: CaseStatus) => Promise<number | undefined>,
}


export default function CaseList ({
    getData,
    getCount,
}: Props){
    const [data, setData] = useState<Case[]>([]);
    const [count, setCount] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>("")
    const [filter, setFilter] = useState<'open' | 'hearing_scheduled' | 'hearing_done' | 'closed' | null>(null)
    const [sortBy, setSortBy] = useState<'date'|'title'|null>(null);
    const [page, setPage] = useState<number>(1)
    const [searchSize, setSearchSize] = useState<number>(10)

    const [showFilterModal, setShowFilterModal] = useState<boolean>(false)

    const getCaseCount = useCallback(async () => {
        try{
            setLoading(true);
            let result = await getCount?.(searchText, filter)
            if(!result){
                throw new Error('Unable to set case count.')    
            }
            console.log(result);
            setCount(result);
        } catch(err : any){
            console.log(err);
            setCount(0);
        } finally{
            setLoading(false);
        }
    }, [searchText, filter])

    

    const getCases = useCallback(async () => {
        try{
            setLoading(true);
            let result = await getData?.(searchText, filter, page)
            if(!result){
                throw new Error('Unable to get cases.')        
            }
            console.log(result);
            setData(result);
        } catch(err:any){
            console.log(err);
        } finally{
            setLoading(false);
        }
    }, [searchText, filter, page])


    useEffect(() => {
        getCaseCount();
        getCases();
    }, [])

    const applyFilters = useCallback(async () => {
        try{
            setLoading(true);
            await getCaseCount();
            await getCases();
            setShowFilterModal(false);

        } catch(err : any){
            console.log(err);
            Alert.alert('Unable to fetch cases');

        } finally{
            setLoading(false);
        }
    }, [getCaseCount, getCases])


    const throttleApplyFilters = useMemo(() => throttle(applyFilters), [applyFilters])



    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {console.log("Search for new data"); getCaseCount(); getCases()}, 500);
    //     return () => {clearTimeout(timeoutId)};
    // }, [searchText, filter, page])


    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                {/* <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
                    <FontAwesome name="filter" color={COLORS.text1}/>
                    <CustomText type='caption'>Filter</CustomText>
                </TouchableOpacity> */}

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
                                        placeholder="Search case name"
                                        label="Search the name of a case"
                                        icon={<FontAwesome name="search" size={12} color={COLORS.text1}/>}
                                        secureTextEntry={false}
                                        size='sm'
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
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('open')}>
                                                {
                                                    filter === 'open' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Open</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('hearing_scheduled')}>
                                                {
                                                    filter === 'hearing_scheduled' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Hearing Scheduled</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('hearing_done')}>
                                                {
                                                    filter === 'hearing_done' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Hearing completed</CustomText>
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
                    title='Open'
                    color={filter === 'open' ? COLORS.buttonPrimary : COLORS.inputBackground}
                    textColor={filter !== 'open' ? COLORS.text2 : COLORS.buttonText}
                    onPress={() => {setFilter?.('open')}}
                    size="sm"
                />
                <CustomButton
                    title='Scheduled'
                    color={filter === 'hearing_scheduled' ? COLORS.buttonPrimary : COLORS.inputBackground}
                    textColor={filter !== 'hearing_scheduled' ? COLORS.text2 : COLORS.buttonText}
                    onPress={() => {setFilter?.('hearing_scheduled')}}
                    size="sm"
                />
                <CustomButton
                    title='Completed'
                    color={filter === 'hearing_done' ? COLORS.buttonPrimary : COLORS.inputBackground}
                    textColor={filter !== 'hearing_done' ? COLORS.text2 : COLORS.buttonText}
                    onPress={() => {setFilter?.('hearing_done')}}
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
                        width: '100%'
                    }}
                    ListEmptyComponent={<CustomText type='caption'>No cases ongoing</CustomText>}
                    contentContainerStyle={{padding: 10}}
                    renderItem={({item}) => (
                        <CardContainer style={{padding: 12, backgroundColor: 'transparent', width: '100%'}}>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <CustomText type="body" style={{fontWeight: 300, width: '85%'}} numberOfLines={1}>{item.header}</CustomText>

                                <TouchableOpacity>
                                    <SimpleLineIcons name="options-vertical" color={COLORS.text3}/>    
                                </TouchableOpacity>
                            </View>

                            <Spacer height={8}/>
                            <CustomText type="caption" numberOfLines={2} style={{fontSize: 11}}>{item.description}</CustomText>

                            <Spacer height={18}/>
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24}}>
                                    <CustomText type="caption">Status</CustomText>
                                    <CustomText type="caption">{item.status ? STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] : 'N/A'}</CustomText>
                                </View>
                                <View>
                                    <CustomText type="caption" style={{fontWeight: 300}}>Hearing scheduled?</CustomText>
                                    <CustomText type="caption">{item.hearing_datetime ? new Date(item.hearing_datetime).toDateString() : 'N/A'}</CustomText>
                                </View>
                            </View>                            
                        </CardContainer>
                    )}
                    ItemSeparatorComponent={() => 
                        // <View style={{borderColor: '#e9e4e4ff', borderBottomWidth: 1, width: '100%',}}></View>
                        <Spacer height={12}/>
                    }
                />
                <Pagination total={count} updatePage={setPage} currentPage={page} resultsPerPage={searchSize} />
            </View>


        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
    },

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

    inputOuter: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
    },

    inputText: {
        fontSize: 13,
        color: "#787676ff",
    },
    placeholder: {
        color: "#787676ff",
    },

    inputInner:{   
        height: 35,     
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#b9b4b4ff',
        paddingHorizontal: 7,
        borderRadius: 10,

    },

    filterButton: {
        height: 35,    
        width: '20%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#b9b4b4ff',
        gap: 5,
        borderRadius: 10,
        borderWidth: 1,
        color: "#787676ff",
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

    filterOptions: {
        padding: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },

    filterText: {
        fontSize: 12,
        textAlign: 'center',
        color: "#837783ff"
    },

    list: {
        width: '100%',
        alignItems: 'center',
        flex: 1,
        // borderWidth: 1,
    },

    // listHeader: {
    //     display: 'flex',
    //     flexDirection: 'row', 
    //     justifyContent: 'space-evenly',
    //     alignItems: 'center',
    //     gap: 10,
    //     paddingVertical: 12,
    //     paddingHorizontal: 12,
    //     backgroundColor: PURPLE[200],
    //     marginHorizontal: 'auto',
    //     width: '95%',
    //     borderRadius: 8,
    //     // borderWidth: 1,
    // },

    listItem: {
        minHeight: 30,
        width: '90%',
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

    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        width: '100%',
    },

    labelAndValue: {
        marginTop: 5,
        display: 'flex', 
        flexDirection: 'column',
    },

    label: {
        fontSize: 12,
        color: '#464242ff',
        fontWeight: '200',
    },

}
)