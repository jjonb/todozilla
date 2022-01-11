import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { ref, update, remove } from "firebase/database";

const Task = (props) => {
  const [text, onChangeText] = useState("");
  const [toggleEdit, setToggleEdit] = useState(false);
  const userScoreRef = ref(props.db, "scores/" + props.userID);

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

  const handleComplete = (taskID) => {
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
    <View>
      <View style={{ flexDirection: "row" }}>
        <Pressable onPress={() => handleComplete(props.item.id)}>
          <Text>{props.item.complete ? "🆗" : "🟦"}</Text>
        </Pressable>
        <Pressable
          onLongPress={() => deleteTask(props.item.id)}
          onPress={() => handleEdit()}
        >
          <View>
            {toggleEdit ? (
              <TextInput
                autoFocus={true}
                onChangeText={onChangeText}
                value={text}
                onSubmitEditing={() => handleEdit()}
              ></TextInput>
            ) : (
              <Text>{props.item.name}</Text>
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
