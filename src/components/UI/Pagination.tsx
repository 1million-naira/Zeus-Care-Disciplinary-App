import { PURPLE } from "@/src/constants";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Props = {
    total? : number,
    updatePage? : (pageNumber: number) => void,
    currentPage? : number,
    resultsPerPage? : number,
}

export default function Pagination ({
    total = 100,
    updatePage,
    currentPage = 1,
    resultsPerPage = 10,
} : Props) {

    const pageNumbers : number[] = []

    for(let i = 1; i<=Math.ceil(total/resultsPerPage); i++){
        pageNumbers.push(i)
    }

    console.log('Length: ', pageNumbers.length)


    return (
        <View style={styles.container}>
            <View style={styles.paginationContainer}>
                {currentPage > 1 ? 
                (<TouchableOpacity onPress={() => {updatePage?.(currentPage - 1); console.log(currentPage)}} 
                    style={styles.paginationButtons}>
                    <MaterialIcons name='chevron-left' size={18} color='#666262ff'/>
                    <Text style={styles.paginationButtonText}>Previous page</Text>
                </TouchableOpacity>
                ) : null
                }

                {currentPage < pageNumbers.length ? 
                    (
                        <TouchableOpacity onPress={() => {updatePage?.(currentPage + 1); console.log(currentPage)}} 
                            style={styles.paginationButtons}>
                            <Text style={styles.paginationButtonText}>Next page</Text>
                            <MaterialIcons name='chevron-right' size={18} color='#666262ff'/>
                        </TouchableOpacity>
                    ) : null
                }
            </View>
            <Text style={[styles.paginationButtonText]}>Page {currentPage} of {pageNumbers.length}</Text>
        </View>
    )
}


const styles = StyleSheet.create({

    container: {
        paddingVertical: 10
    }, 

    paginationContainer: {
        width: '70%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        // gap: 50,
        // borderWidth: 1,
    },

    paginationButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: PURPLE[100],
        shadowColor: "#000",
        shadowOffset: {
            width: 0.2,
            height: 0.1,
        },
        shadowOpacity: 0.17,
        shadowRadius: 2,

        elevation: 3,
    },

    paginationButtonText: {
        fontSize: 12,
        color: "#7f7a7aff",
    }
})