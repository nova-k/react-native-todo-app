import React, { useState } from "react";
import { View, StyleSheet, TextInput, Alert, Keyboard } from "react-native";
import {AntDesign} from '@expo/vector-icons'
import { THEME } from "../theme";



export const AddTodo = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  const pressHandler = () => {
    if (value.trim()) {
      onSubmit(value);
	  setValue("");
	  Keyboard.dismiss()
    } else {
      Alert.alert("Название дела не может быть пустым!");
    }
  };

  return (
    <View style={styles.block}>
      <TextInput
        style={styles.input}
        onChangeText={text => setValue(text)}
        value={value}
        placeholder="Введите название дела..."
		autoCorrect={false}
        autoCapitalize="none"
      />

	  
	  <AntDesign.Button onPress={pressHandler} name="pluscircle">
	 	 Добавить
	  </AntDesign.Button>
    </View>
  );
};
const styles = StyleSheet.create({
  block: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },
  input: {
    width: "60%",
    borderStyle: "solid",
    borderBottomWidth: 2,
    borderBottomColor: THEME.MAIN_COLOR,
    padding: 10
  }
});
