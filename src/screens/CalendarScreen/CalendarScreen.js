import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Button } from "react-native";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { AppLoading } from "expo";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";

export default function CalendarScreen(props) {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });
  const [loading, setLoading] = useState(true);
  const [userGoals, setUserGoals] = useState(null);
  const [goalColors, setGoalColors] = useState(null);
  const [userDates, setUserDates] = useState(null);
  const userGoalKeys = ["goal1", "goal2", "goal3"];

  useEffect(() => {
    if (loading) {
      const monthlyGoalsRef = firebase
        .firestore()
        .collection("monthly_goals")
        .doc(props.current);
      monthlyGoalsRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setUserGoals(doc.data()[props.user.id]);
            const goalColorsRef = firebase
              .firestore()
              .collection("appData")
              .doc("goalColors");
            goalColorsRef.get().then(function (doc) {
              if (doc.exists) {
                setGoalColors(doc.data());
                const markedDatesRef = firebase
                  .firestore()
                  .collection("markedDates")
                  .doc(props.user.id);
                markedDatesRef.get().then(function (doc) {
                  if (doc.exists) {
                    setUserDates(doc.data()["dates"]);
                  } else {
                    console.log("No such document!");
                  }
                });
              } else {
                console.log("No such document!");
              }
            });
          } else {
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
      if (userGoals && goalColors && userDates) {
        setLoading(false);
      }
    }
  }, [userGoals, goalColors, userDates]);

  if (loading) {
    return <AppLoading />;
  } else {
    return (
      <>
        <Text style={styles.title}>Happy{"\n"}Calendar</Text>
        <Calendar markingType={"period"} markedDates={userDates} />
        <View style={styles.container}>
          {userGoalKeys.map((goalKey) => {
            return (
              <View>
                <Text
                  style={{
                    fontFamily: "Montserrat_600SemiBold",
                    fontSize: 12,
                    color: goalColors[goalKey],
                  }}
                >
                  {userGoals[goalKey]}
                </Text>
              </View>
            );
          })}
        </View>
      </>
    );
  }
}
