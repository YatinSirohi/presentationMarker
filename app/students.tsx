import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function StudentsView() {
    type Student = {
        _id: string;
        name: string;
        points?: number[];
    };

    const [student, setStudent] = useState<Student[]>([]);
    const [value, setValue] = useState<string | null>(null);
    const [isFocus, setIsFocus] = useState(false);
    const [submittedStudents, setSubmittedStudents] = useState<{ [key: string]: boolean }>({});

    const showStudentName = async () => {
        try {
            const response = await fetch("http://localhost:5000/get-student", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log("Fetched Data:", data);
            if (data?.message && Array.isArray(data.message)) {
                setStudent(data.message);
            }
        } catch (error) {
            console.error("Error fetching student name:", error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(showStudentName, 2000); // Poll every 2 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    const data = Array.from({ length: 20 }, (_, i) => ({
        label: `${i + 1}`,
        value: `${i + 1}`,
    }));

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    How many points for this presentation ?
                </Text>
            );
        }
        return null;
    };

    const updateStudentPoints = async (studentName: string, points: number) => {
        try {
            const response = await fetch(`http://localhost:5000/update-points`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: studentName, points }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Failed to update points`);
            }

            console.log("Points updated successfully:", result);
            return result;
        } catch (error) {
            console.error("Error updating points:", error);
            throw error;
        }
    };

    const submitPoints = async () => {
        if (!student.length || !value) {
            console.warn("Please select a student and points before submitting.");
            return;
        }

        try {
            const studentName = student[0].name;
            const points = parseInt(value, 10);

            const result = await updateStudentPoints(studentName, points);

            setStudent((prevStudents) =>
                prevStudents.map((s) =>
                    s.name === studentName
                        ? { ...s, points: [...(s.points || []), points] }
                        : s
                )
            );

            // Mark the student as submitted
            setSubmittedStudents((prevState) => ({
                ...prevState,
                [studentName]: true,
            }));

            Alert.alert("Success", "Points have been successfully submitted.", [
                { text: "OK" },
            ]);
            console.log(result.message);
        } catch (error) {
            console.error("Failed to submit points:", error);
        }
    };

    return (
        <SafeAreaView>
            <View style={styles.containerStudentName}>
                <Text style={styles.topheader}>Student Name:</Text>
                <ScrollView>
                    {student.map((student, index) => (
                        <Text style={styles.studentname} key={student._id || index} >
                                {student.name}
                        </Text>
                    ))}
                </ScrollView>
                <Text style={styles.header}>Select Point (out of 20):</Text>
            </View>
            <View style={styles.container}>
                {renderLabel()}
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select a number' : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                        setValue(item.value);
                        setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                            style={styles.icon}
                            color={isFocus ? 'blue' : 'black'}
                            name="Safety"
                            size={20}
                        />
                    )}
                />
                {value && <Text style={styles.selectedValue}>Selected Point: {value}</Text>}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.submitbtn,
                        submittedStudents[student[0]?.name] ? { backgroundColor: 'lightblue' } : {},
                    ]}
                    onPress={submitPoints}
                    disabled={submittedStudents[student[0]?.name]} // Disable if points are already submitted
                >
                    <Text style={styles.buttonText}>Submit points</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerStudentName: {
        paddingLeft: 10
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 5,
    },
    topheader: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 5,
        marginTop: 30,
    },
    studentname: {
        fontSize: 25,
        padding: 10,
        color: "blue"
    },
    selectedNumber: {
        fontSize: 18,
        color: "blue",
        textAlign: "center",
        marginTop: 10,
    },
    container: {
        backgroundColor: 'white',
        padding: 20,
        marginTop: 10
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    selectedValue: {
        marginTop: 20,
        fontSize: 16,
        color: 'blue',
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    submitbtn: {
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'blue',
        width: 150,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15
    },
});
