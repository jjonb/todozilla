import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
} from "react-native";
import { useAuth } from "../context/AuthContext";

import Loading from "./Loading";

import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const Auth = (props) => {
  const [authScreen, setAuthScreen] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { userID, dispatchUserEvent, isLoading } = useAuth();

  //checks userID in real-time and navigates to screen accordingly
  useEffect(() => {
    if (userID !== "") {
      props.navigation.replace("Home");
    }
    return () => {};
  }, [userID]);

  //checks to see if keyboard is open/closed; mainly for input visibility
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = (e) =>
    setKeyboardHeight(e.endCoordinates.height * 0.85);
  const _keyboardDidHide = () => setKeyboardHeight(0);

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: 433,
            height: 250,
            alignItems: "center",
          }}
        >
          <ImageBackground
            source={require("../assets/logo_circles.png")}
            style={{ width: 433, height: 428, left: -125, top: -200 }}
            resizeMode={"contain"}
          >
            <Image
              style={{ width: "100%", height: 50, left: 125, top: 300 }}
              resizeMode={"contain"}
              source={require("../assets/logo.png")}
            />
          </ImageBackground>
        </View>

        <Text
          style={{
            fontSize: 30,
            fontFamily: "Karla-Regular",
          }}
        >
          Welcome,
        </Text>
        <Text
          style={{
            marginBottom: 10,
            marginTop: 2,
            fontSize: 12,
            fontFamily: "Karla-Regular",
          }}
        >
          {authScreen === "Register"
            ? "Sign up to Continue"
            : "Login to Continue"}
        </Text>

        {authScreen === "Register" ? (
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              style={{ position: "absolute", left: 10 }}
              name="account-edit-outline"
              size={25}
              color="black"
            />
            <TextInput
              placeholder="First Name"
              onChangeText={setName}
              value={name}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
        ) : (
          <></>
        )}
        <View style={styles.inputContainer}>
          <MaterialIcons
            style={{ position: "absolute", left: 10 }}
            name="mail-outline"
            size={25}
            color="black"
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            style={{ position: "absolute", left: 10 }}
            name="key-outline"
            size={25}
            color="black"
          />
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            autoCapitalize="none"
          />
        </View>
        {authScreen === "Register" ? (
          <View style={styles.inputContainer}>
            <Ionicons
              style={{ position: "absolute", left: 10 }}
              name="lock-closed-outline"
              size={25}
              color="black"
            />
            <TextInput
              secureTextEntry={true}
              placeholder="Confirm Password"
              onChangeText={setPasswordCheck}
              value={passwordCheck}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
        ) : (
          <></>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          disabled={
            authScreen === "Register" && password === "" && passwordCheck === ""
          }
          onPress={
            authScreen === "Register"
              ? () => {
                  if (passwordCheck === password) {
                    dispatchUserEvent("REGISTER", {
                      name: name,
                      email: email,
                      password: password,
                    });
                  } else {
                    Alert.alert("Error", "Passwords do not match.", [
                      { text: "OK" },
                    ]);
                  }
                }
              : () => {
                  if (email !== "" && password !== "") {
                    dispatchUserEvent("LOGIN", {
                      email: email,
                      password: password,
                    });
                  } else {
                    Alert.alert("Error", "Please input your information.", [
                      { text: "OK" },
                    ]);
                  }
                }
          }
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              fontFamily: "Karla-Regular",
              color: "white",
            }}
          >
            {authScreen === "Register" ? "Sign Up" : "Login"}
          </Text>
        </TouchableOpacity>
        {authScreen === "Register" ? (
          <Text style={{ color: "black", fontFamily: "Karla-Regular" }}>
            Already have an account?{" "}
            <Text
              style={{ color: "black", fontFamily: "Karla-Bold" }}
              onPress={() => setAuthScreen("Login")}
            >
              Login
            </Text>
          </Text>
        ) : (
          <Text style={{ color: "black", fontFamily: "Karla-Regular" }}>
            Don't have an account?{" "}
            <Text
              style={{ color: "black", fontFamily: "Karla-Bold" }}
              onPress={() => setAuthScreen("Register")}
            >
              Sign Up
            </Text>
          </Text>
        )}
        <View style={{ height: keyboardHeight }}></View>
      </View>
    );
  }
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 7.5,
    marginBottom: 10,
    elevation: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    width: width * 0.75,
    textAlign: "center",
    paddingVertical: 7,
    backgroundColor: "rgba(0,0,0,0)",
    fontSize: 12,
    fontFamily: "Karla-Regular",
  },
  actionButton: {
    padding: 10,
    elevation: 15,
    shadowColor: "#000",
    backgroundColor: "#2F56F8",
    borderRadius: 15,
    width: width * 0.375,
    marginTop: 7.5,
    marginBottom: 15,
    fontFamily: "Karla-Regular",
  },
});
