import { useSession } from "@/context/SessionProvider"
import { MemberRole } from "@/src/Types/Types"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import CustomButton from "./CustomButton"
import { AntDesign, FontAwesome, FontAwesome6, SimpleLineIcons } from "@expo/vector-icons"
import { COLORS } from "@/src/colors"
import { Modal } from "react-native"
import CustomInput from "./CustomInput"
import CustomText from "./CustomText"
import Spacer from "./Spacer"
import DefaultProfile from "./DefaultProfile"
import { supabaseGetPublicUrl } from "@/src/helpers/storageHelpers"
import Pagination from "./Pagination"

type Employee = {
    id: string
    avatar_url: string | null
    name: string
    role: MemberRole
}

type Props = {
    getData?: (page: number, filter: MemberRole | null, searchText: string) => Promise<Employee[] | undefined>;
    getCount?: (status: MemberRole | null, searchText: string) => Promise<number | undefined>;
}





export default function EmployeeList({getData, getCount} : Props){



    const {session} = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false)

    const [data, setData] = useState<Employee[]>([])
    const [filter, setFilter] = useState<MemberRole | null>(null)

    const [showFilterModal, setShowFilterModal] = useState<boolean>(false)

    const [searchText, setSearchText] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const [totalCount, setTotalCount] = useState<number>(0)
    const [searchSize, setSearchSize] = useState<number>(10)


    async function getEmployeeCount(){
        try{
            setLoading(true);
            let count = await getCount?.(filter, searchText);
            if(!count){
                console.log('error')
                throw new Error('Unable to set employee count.')   
            }
            console.log(count);
            setTotalCount(count);
        } catch(err : any){
            console.log(err);
            setTotalCount(0);
        } finally{
            setLoading(false)
        }
    }

    async function getEmployees(){
        try{
            setLoading(true)
            let data = await getData?.(page, filter, searchText);
            if(!data){
                throw new Error('Unable to fetch employees')
            }
            setData(data);
        } catch(err:any){
            console.log(err);
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getEmployeeCount();
        getEmployees();
    }, [])

    async function applyEmployeeFilter(){
        if(loading) return;

        try{
            setLoading(true)
            await getEmployees();
            setShowFilterModal(false);
        } catch(err:any){
            console.log(err);
            Alert.alert('Unable to fetch employees');
        } finally{
            setLoading(false)
        }
    }

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
                                        placeholder="Search employee name"
                                        label="Search the name of an employee"
                                        icon={<FontAwesome name="search" size={12} color={COLORS.text1}/>}
                                        secureTextEntry={false}
                                        size='sm'
                                    />

                                    <View style={{marginTop: 24}}>
                                        <CustomText type='subheading'>Employee Role</CustomText>

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
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('admin')}>
                                                {
                                                    filter === 'admin' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Admin</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('manager')}>
                                                {
                                                    filter === 'manager' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Manager</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('staff')}>
                                                {
                                                    filter === 'staff' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Staff</CustomText>
                                        </View>
                                        <View style={{display: 'flex', flexDirection: 'row', gap: 8}}>
                                            <TouchableOpacity style={{width: 25, height: 25, borderWidth: 0.2, borderRadius: 4}} onPress={() => setFilter('supervisor')}>
                                                {
                                                    filter === 'supervisor' ? (
                                                        <View style={{borderRadius: 4, width: '100%', height: '100%', backgroundColor: COLORS.buttonSecondary, alignItems: 'center', justifyContent: 'center'}}>
                                                            <FontAwesome6 name='check' color={COLORS.background}/>
                                                        </View>
                                                    ) : null
                                                }
                                            </TouchableOpacity>
                                            <CustomText>Supervisor</CustomText>
                                        </View>

                                    </View>
                                    {/* <View style={{marginTop: 24}}>
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
                                    </View> */}
                                    <View style={{alignItems: 'center', marginTop: 64}}>
                                        <CustomButton title="Apply filters" color={COLORS.buttonSecondary} size="lg" onPress={() => applyEmployeeFilter()}/>
                                    </View>
                                </View>


                            </View>

                        </Modal>
                    ) : null
                }
            </View>
            <Spacer height={28}/>
            <View style={styles.list}>
                <FlatList
                    data={data}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            style={{paddingBottom: 12, paddingTop: 16, display: 'flex', flexDirection: 'row', 
                            justifyContent: 'space-between', alignItems: 'center', width: '100%'}}
                            onPress={() =>
                                router.push({
                                    pathname: '/(app)/(pages)/employees/[id]',
                                    params: {id: item.id}
                                })
                            }
                        >
                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                                <DefaultProfile size={45} url={ item.avatar_url ? (supabaseGetPublicUrl('avatars', item.avatar_url) || '') : ''}/>
                                <View>
                                    <CustomText>{item.name}</CustomText>
                                    <CustomText type="caption">{item.role.charAt(0).toUpperCase() + item.role.slice(1)}</CustomText>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => console.log('Option pressed')}>
                                <SimpleLineIcons name="options-vertical" color={COLORS.text3}/>    
                            </TouchableOpacity>
                        </TouchableOpacity>

                    )}
                    keyExtractor={(item : Employee, index) => item.id + index.toString()}
                    ListEmptyComponent={() => <CustomText type="caption">No members found</CustomText>}
                    refreshing={loading}
                />
                <Pagination total={totalCount} updatePage={setPage} currentPage={page} resultsPerPage={searchSize} />
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