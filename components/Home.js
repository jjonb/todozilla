import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import { AuthContext } from "../context/AuthContext";

const Home = (props) => {
  const { auth, userID } = useContext(AuthContext);

  const db = getDatabase();
  const taskListRef = ref(db, "profiles/" + userID + "/tasks/");
  const newTaskRef = push(taskListRef);

  const [highScore, setHighScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [tasks, setTasks] = useState([]);

  const [taskName, setTaskName] = useState("");

  const { width } = Dimensions.get("window");

  useEffect(() => {
    return onValue(taskListRef, (snapshot) => {
      if (snapshot.val() !== null) {
        const data = snapshot.val();
        let result = Object.keys(data).map((key) => data[key]);

        setTasks(result);
      } else {
        setTasks([]);
      }
    });
  }, []);

  //checks on userID and executes when it changes
  useEffect(() => {
    if (userID === "") {
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      });
    }
    return () => {};
  }, [userID]);

  const onSubmit = (name) => {
    if (name === "") {
      return;
    }

    set(newTaskRef, {
      name: name,
      complete: false,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Highest Score: {highScore}</Text>
      <Text>Current Score: {currentScore}</Text>
      <View style={{ width: width * 0.8 }}>
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => tasks.indexOf(item)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
      <View
        style={{
          width: width * 0.8,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <TextInput
          value={taskName}
          onChangeText={setTaskName}
          style={styles.input}
          placeholder="Task Name"
        />
        <TouchableOpacity onPress={() => onSubmit(taskName)}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8CC",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
  },
  button: {
    marginBottom: 20,
    backgroundColor: "#F0BB62",
  },
});
