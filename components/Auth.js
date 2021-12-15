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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { userID, dispatchUserEvent } = useContext(AuthContext);

  useEffect(() => {
    if (userID !== "") {
      props.navigation.replace("Home");
    }
    return () => {};
  }, [userID]);

  return (
    <View style={styles.container}>
      <Text>Log in or Register</Text>
      <TextInput
        style={styles.input}
        placeholder="(For Register) First Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity
        onPress={() =>
          dispatchUserEvent("LOGIN", {
            email: email,
            password: password,
          })
        }
      >
        <Text>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (name === "") {
            Alert.alert("Please enter your name.");
            return;
          }

          dispatchUserEvent("REGISTER", {
            name: name,
            email: email,
            password: password,
          });
        }}
      >
        <Text>Register</Text>
      </TouchableOpacity>
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
