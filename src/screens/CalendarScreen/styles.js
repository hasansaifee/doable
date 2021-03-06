import { StyleSheet } from "react-native";

const goal1 = "#EA6648";
const goal2 = "#FDC16B";
const goal3 = "#4A59A8";

export default StyleSheet.create({
  circle1: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: goal1,
  },
  circle2: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: goal2,
  },
  circle3: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: goal3,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 7,
    paddingLeft: 50,
    paddingRight: 50,
  },
  title: {
    fontFamily: "Montserrat_600SemiBold",
    fontSize: 40,
    paddingLeft: 30,
    backgroundColor: "#fff",
    paddingBottom: 30,
    paddingTop: 30,
  },
});
