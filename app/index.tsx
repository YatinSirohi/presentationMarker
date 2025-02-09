import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (code === "7878") {
      router.replace("/admin"); // Navigate to Admin page
    } else {
      Alert.alert("Access Denied", "Incorrect code! Redirecting to Students View.");
      router.replace("/students"); // Navigate to Students View
    }
  };

  const openStudentView = () => {
    router.replace("/students");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Admin Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Code"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
      <Text style={styles.header}>Students should tap this button</Text>
      <TouchableOpacity style={styles.studentViewBtn} onPress={openStudentView}>
        <Text style={styles.buttonText}>Open Student View</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(233, 236, 240)",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
  },

  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "90%",
  },
  line: {
    height: 1,
    backgroundColor: "gray",
    flex: 1,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 18,
    color: "gray",
  },

  studentViewBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  }
});
