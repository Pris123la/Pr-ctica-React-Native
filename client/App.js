import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Task from './components/Task';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchData();
  },[])

  async function fetchData(){
    const response = await fetch("http://192.168.0.15:8080/todos/1");
    const data = await response.json();
    setTodos(data);
  }
  function clearTodo(id){
      setTodos(todos.filter((todo)=>todo.ID !== id));
  }

  function toggleTodo(id){
      setTodos(
          todos.map((todo)=>
              todo.ID === id ? {...todo,COMPLETED: todo.COMPLETED === 1 ? 0 : 1} : todo
          )
      );

  }
  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/* <Text>{JSON.stringify(todos,null,2)}</Text> */}
        <SafeAreaView>
          <FlatList
            data={todos}
            renderItem={({item})=>(
              <Task {...item} toggleTodo={toggleTodo} clearTodo={clearTodo} /> //paso destructuradamente cada propiedad de item
            )}
            keyExtractor={(todo)=>todo.ID}
            ListHeaderComponent={()=><Text style={styles.title} >Actividades de hoy</Text>}
            contentContainerStyle={styles.contentContainerStyle}
          />
          {/* para vista scrollable */}
        </SafeAreaView>
        <StatusBar style="auto" />
      </View>
    </BottomSheetModalProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#b5b5b5",
  },
  contentContainerStyle:{
    padding: 15,
  },
  title:{
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 15,
  }

});
