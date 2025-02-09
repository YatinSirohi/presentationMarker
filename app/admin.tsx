import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function Admin() {

  const [text, onChangeText] = React.useState("")
  type Student = {
    name: string,
    points: number[],
    averagePoints?: number;
  }; // Define the type of the student name field
  const [data, setData] = React.useState<Student[]>([]); // Use the type in useState
  const [studentData, setStudentData] = React.useState<Student[]>([]);

  const sendStudentName = async () => {
    try {
      onChangeText("")
      const response = await fetch('http://localhost:5000/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: text, points: [] }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', 'Student name added successfully!');
        console.log("Response from backend:", result);

        const studentName = await fetch('http://localhost:5000/get-student', {  //Admin gets student list as they add a new student
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const studentData = await studentName.json();
        console.log('All Students:', studentData.message);
        setData(studentData.message);

      } else {
        Alert.alert('Error', 'Failed to add student name.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const deleteStudentName = async () => {
    try {
      const response = await fetch('http://localhost:5000/delete-students', {
        method: 'DELETE',
      });

      // Check response status
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', result.message || 'Student(s) deleted successfully!');
        setData([]);
        setStudentData([])
        console.log("Response from backend:", result);
      } else {
        Alert.alert('Error', result.error || 'Failed to delete student name.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const getStudentAveragePoints = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-student', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const studentDataJson = await response.json();
      const studentData = studentDataJson.message;

      // Calculate average points for each student
      const updatedStudentData = studentData.map((student: { points: any[]; }) => {
        const totalPoints = student.points.reduce((sum, point) => sum + point, 0); // Sum of points
        const averagePoints = student.points.length > 0 ? totalPoints / student.points.length : 0; // Avoid divide by zero
        return { ...student, averagePoints }; // Add averagePoints field
      });

      setStudentData(updatedStudentData); // Update state with the new data
      console.log("Student data with averages: ", updatedStudentData);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong while fetching average points.');
    }
  };


  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(233, 236, 240)"
      }}
    >
      <Text style={styles.txt}>Enter Student name below</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <TouchableOpacity style={styles.submitbtn} onPress={sendStudentName}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deletebtn} onPress={deleteStudentName}>
        <Text style={styles.buttonText}>Clear Names</Text>
      </TouchableOpacity>
      <View style={styles.listContainer}>
        <Text style={styles.studentHeader}>Student</Text>
        <ScrollView style={styles.scrollView}>
          {data.map((student, index) => (
            <Text key={index} style={styles.studentItem}>{student.name}, {student.points} </Text>
          ))}
        </ScrollView>
      </View>
      <View>
        <Text style={styles.AveragePointsHeader}>Average Points</Text>
        <View>
          {studentData.map((student, index) => (
            <Text key={index} style={styles.averagePointsDetails}>
               <Text style={{color:"blue"}}>{student.name}, {(student.averagePoints ?? 0).toFixed(2)}
              Points given by {student.points.length} students</Text>
            </Text>
          ))}
        </View>
        <TouchableOpacity style={styles.AveragePointsButton} onPress={getStudentAveragePoints}>
          <Text style={styles.buttonText}>Get Average Points
          </Text>
        </TouchableOpacity>

      </View>
      <Link href="/students" asChild>
        <TouchableOpacity style={styles.studentViewButton}>
          <Text style={styles.buttonText}>Students View</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  txt: {
    fontSize: 20,
    padding: 5,
    marginTop: "25%"
  },

  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 15,
    borderRadius: 10
  },

  submitbtn: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'blue',
    width: 110,
    marginTop: 10,
  },

  deletebtn: {
    borderRadius: 10,
    padding: 8,
    backgroundColor: 'red',
    width: 140,
    marginTop: 10,
    marginBottom: 20
  },

  AveragePointsButton: {
    borderRadius: 10,
    padding: 8,
    backgroundColor: 'green',
    width: 200,
    height: 50,
    marginTop: 20,
    alignSelf: 'center',
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15
  },

  listContainer: {
    flex: 1, // Ensures list occupies remaining space
    marginTop: 10,
  },

  scrollView: {
    // flexGrow: 0, // Prevents the scroll view from expanding unnecessarily
  },

  studentHeader: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  AveragePointsHeader: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -300,
    padding: 10
  },

  studentItem: {
    backgroundColor: "#fff",
    fontSize: 15,
    padding: 5,
    marginVertical: 1,
    width: 300,
    borderRadius: 5,
    elevation: 3,
  },

  averagePointsDetails: {
    backgroundColor: "#fff",
    fontSize: 15,
    padding: 5,
    width: 300,
    borderRadius: 5,
    elevation: 3,
    marginTop: 5
  },

  studentViewButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});