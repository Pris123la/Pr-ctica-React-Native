import * as React from "react";
import { View, Text, StyleSheet,TouchableOpacity,Pressable} from "react-native";
import {Feather} from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import TodoModalContent from "./TodoModalContent";
import SharedTodoModalContent from "./SharedTodoModalContent"

function CheckMark({ID,COMPLETED,toggleTodo}){
    async function toggle(){
        const response = await fetch(`http://192.168.0.15:8080/todos/${ID}`,{
            headers: {
                // "x-api-key": "abcdef123456",
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify({
                value: COMPLETED ? false : true,
            }),
        });
        const data = await response.json();
        toggleTodo(ID);
        console.log(data);
    }
    return(
        <Pressable onPress={toggle} style={[styles.checkMark,{ backgroundColor: COMPLETED === 0 ? "#E9E9EF" : "#0EA5E9"}]} ></Pressable>
    )
}



export default function Task({
    ID,
    TITLE,
    SHARED_WITH_ID,
    COMPLETED,
    clearTodo,
    toggleTodo,
}){
    const [isDeleteActive, setIsDeleteActive] = React.useState(false);

    const bottomSheetModalRef = React.useRef(null);
    const sharedBottomSheetRef = React.useRef(null);
    const snapPoints = ["25%","48%","75%"];
    const snapPointsShared = ["40%"];

    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
    }
    
    function handlePresentShared() {
        sharedBottomSheetRef.current?.present();
    }

    async function deleteTodo(){
        const response = await fetch(`http://192.168.0.15:8080/todos/${ID}`,{
            method: "DELETE",
        });
        clearTodo();
        console.log(response.status);
        };

        

    return(

        <TouchableOpacity
            onLongPress={() => setIsDeleteActive(true)}
            onPress={() => setIsDeleteActive(false)}
            activeOpacity={0.8}
            style={styles.container}
        >
            <View style={styles.containerTextCheckBox}>
                <CheckMark ID={ID} COMPLETED={COMPLETED} toggleTodo={toggleTodo} />
                <Text style={styles.text} >{TITLE}</Text>
            </View>
            {SHARED_WITH_ID !== null ? (
                <Feather 
                    onPress={handlePresentShared} 
                    name="users" 
                    size={24} 
                    color="#56636F" 
                />):
                (<Feather 
                    onPress={handlePresentModal} 
                    name="share" 
                    size={24} 
                    color="#56636F" />)
            }
            {
                isDeleteActive && (
                    <Pressable onPress={deleteTodo} style={styles.deleteButton}>
                        <Text style={{color:"white", fontWeight:"bold"}}>x</Text>
                    </Pressable>
                )
            }

            <BottomSheetModal ref={sharedBottomSheetRef} snapPoints={snapPointsShared}backgroundStyle={{ borderRadius: 50, borderWidth: 4 }}>
                <SharedTodoModalContent id={ID} title={TITLE} shared_with_id={SHARED_WITH_ID} completed={COMPLETED}/>
            </BottomSheetModal>

            <BottomSheetModal ref={bottomSheetModalRef} index={2} snapPoints={snapPoints} backgroundStyle={{ borderRadius: 50, borderWidth: 4 }}>
                <TodoModalContent id={ID} title={TITLE} />
            </BottomSheetModal>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    description: {
        color: "#56636F",
        fontWeight: "normal",
        fontSize: 13,
        width: "100%",
    },
    subtitle: {
        color: "#101318",
        fontWeight: "bold",
        fontSize: 14,
    },
    title: {
        fontWeight: "900",
        fontSize: 16,
        letterSpacing: 0.5,
    },
    row: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 15,

    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
        borderRadius: 21,
        marginBottom: 10,
        backgroundColor: "white",
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
    checkMark: {
        width: 20,
        height: 20,
        borderRadius: 4,
        marginRight: 10,
    },
    containerTextCheckBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    deleteButton: {
        backgroundColor: "red",
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
})