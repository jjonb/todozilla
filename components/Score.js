import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";

const Score = (props) => {
  const db = getDatabase();
  const scoreRef = ref(db, "scores/");

  const [highScoreList, setHighScoreList] = useState([]);

  const { width } = Dimensions.get("window");

  useEffect(() => {
    return onValue(scoreRef, (snapshot) => {
      if (snapshot.val() !== null) {
        const data = snapshot.val();

        let arr = Object.keys(data)
          .map((key) => data[key])
          .sort((a, b) => a.currentScore < b.currentScore);

        setHighScoreList(arr);
      } else {
        setHighScoreList([]);
      }
    });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Text>
          {index + 1}. {item.name} - {item.currentScore}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <TouchableOpacity
        style={{ color: "blue" }}
        onPress={() => props.navigation.goBack()}
      >
        <Text>Go Back</Text>
      </TouchableOpacity>
      <Text> Scores: </Text>
      <View style={{ width: width * 0.8, height: 500 }}>
        <FlatList
          data={highScoreList}
          renderItem={renderItem}
          keyExtractor={(item) => highScoreList.indexOf(item)}
        />
      </View>
    </View>
  );
};

export default Score;
