import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ref, update, remove } from "firebase/database";
import { FontAwesome } from "@expo/vector-icons";

const Task = (props) => {
  const [text, onChangeText] = useState("");
  const [toggleEdit, setToggleEdit] = useState(false);
  const userScoreRef = ref(props.db, "scores/" + props.userID);
  const { width } = Dimensions.get("window");

  //updates task name
  const onChangeSubmit = (name, taskID) => {
    if (name === "") {
      return;
    }

    const editTaskRef = ref(props.db, "tasks/" + props.userID + "/" + taskID);

    update(editTaskRef, {
      name: name,
    });
  };

  //handles points given when a task is marked true or false for completion
  const handleComplete = (taskID) => {
    if (props.item.name == "") {
      return;
    }

    const taskRef = ref(props.db, "tasks/" + props.userID + "/" + taskID);

    update(taskRef, {
      pointGiven: true,
      complete: !props.item.complete,
    });

    !props.item.pointGiven &&
      update(userScoreRef, { currentScore: props.currentScore + 1 });
  };

  //deletes a task
  const deleteTask = (taskID) => {
    const taskRef = ref(props.db, "tasks/" + props.userID + "/" + taskID);

    remove(taskRef);
  };

  const handleEdit = () => {
    if (toggleEdit) {
      if (text !== "") {
        onChangeSubmit(text, props.item.id);
        //toggles editing mode
        setToggleEdit(!toggleEdit);
      }
    } else {
      //this changes the "text" state
      onChangeText(props.item.name);
      //toggles editing mode
      setToggleEdit(!toggleEdit);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        width: width * 0.9,
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 7.5,
        elevation: 5,
        height: 40,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => handleComplete(props.item.id)}>
          {props.item.complete ? (
            <View
              style={{
                borderRadius: 50,
                width: 20,
                height: 20,
                backgroundColor: "#4BD37B",
                borderColor: "black",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome name="check" size={15} color="white" />
            </View>
          ) : (
            <View
              style={{
                borderRadius: 50,
                width: 20,
                height: 20,
                backgroundColor: "white",
                borderColor: "black",
                borderWidth: 1,
              }}
            ></View>
          )}
        </TouchableOpacity>
        <Pressable
          onLongPress={() => deleteTask(props.item.id)}
          onPress={() => {
            if (!props.item.complete) {
              handleEdit();
            }
          }}
        >
          <View style={{ marginLeft: 10 }}>
            {toggleEdit ? (
              <TextInput
                style={{ fontFamily: "Karla-Regular", fontSize: 18 }}
                autoFocus={true}
                onChangeText={onChangeText}
                value={text}
                onSubmitEditing={() => handleEdit()}
              ></TextInput>
            ) : (
              <Text
                style={{
                  textDecorationLine: props.item.complete
                    ? "line-through"
                    : "none",
                  color: props.item.complete ? "gray" : "black",
                  fontFamily: "Karla-Regular",
                  fontSize: 18,
                }}
              >
                {props.item.name}
              </Text>
            )}
          </View>
        </Pressable>
        <Pressable onPress={() => handleEdit()}>
          <Text>{toggleEdit ? "✅" : ""}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Task;
