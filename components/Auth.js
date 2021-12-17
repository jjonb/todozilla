import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const Auth = (props) => {
  const [authScreen, setAuthScreen] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const { userID, dispatchUserEvent } = useContext(AuthContext);

  useEffect(() => {
    if (userID !== "") {
      props.navigation.replace("Home");
    }
    return () => {};
  }, [userID]);

  return (
    <View style={styles.container}>
      {authScreen === "Register" ? (
        <TextInput
          placeholder="First Name"
          onChangeText={setName}
          value={name}
          style={styles.input}
        />
      ) : (
        <></>
      )}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        secureTextEntry={true}
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
      />
      {authScreen === "Register" ? (
        <TextInput
          secureTextEntry={true}
          placeholder="Re-Type Password"
          onChangeText={setPasswordCheck}
          value={passwordCheck}
          style={styles.input}
        />
      ) : (
        <></>
      )}
      <TouchableOpacity
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
        <Text>{authScreen === "Register" ? "Register" : "Login"}</Text>
      </TouchableOpacity>
      {authScreen === "Register" ? (
        <Text style={{ color: "black" }}>
          Already have an account?{" "}
          <Text
            style={{ color: "blue" }}
            onPress={() => setAuthScreen("Login")}
          >
            Log In
          </Text>
        </Text>
      ) : (
        <Text style={{ color: "black" }}>
          Don't have an account?{" "}
          <Text
            style={{ color: "blue" }}
            onPress={() => setAuthScreen("Register")}
          >
            Sign Up
          </Text>
        </Text>
      )}
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8CC",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    borderWidth: 2,
    borderColor: "#116530",
    marginBottom: 10,
  },
});
