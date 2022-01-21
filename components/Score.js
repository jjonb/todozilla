import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Animated,
  Pressable,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBarHeight } from "../utils/StatusBarHeight";
import { useAuth } from "../context/AuthContext";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const Score = (props) => {
  const { auth, userID } = useAuth();
  const db = getDatabase();
  const scoreRef = ref(db, "scores/");
  const userScoreRef = ref(db, "scores/" + userID);

  const [highScoreList, setHighScoreList] = useState([]);
  const [topThree, setTopThree] = useState([]);

  // bounceValue will be used as the value for translateY. Initial Value: height of device
  const bounceValue = useRef(new Animated.Value(height)).current;
  const [isHidden, setHidden] = useState(true);

  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    return onValue(scoreRef, (snapshot) => {
      if (snapshot.val() !== null) {
        const data = snapshot.val();

        let arr = Object.keys(data)
          .map((key) => data[key])
          .sort((a, b) => b.currentScore - a.currentScore);

        setTopThree(arr.splice(0, 3));

        setHighScoreList(arr.splice(0, 7));
      } else {
        setHighScoreList([]);
      }
    });
  }, []);

  //sets the user's current score
  useEffect(() => {
    return onValue(userScoreRef, (snapshot) => {
      if (snapshot.val() !== null) {
        const data = snapshot.val();
        setCurrentScore(data.currentScore);
      } else {
        setCurrentScore(0);
      }
    });
  }, []);

  const toggleSubview = () => {
    let toValue = height;

    if (isHidden) {
      toValue = 0;
    }

    Animated.spring(bounceValue, {
      toValue: toValue,
      speed: 20,
      useNativeDriver: true,
    }).start();

    setHidden(!isHidden);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          padding: 5,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "Poppins-Regular", fontSize: 22 }}>
          {index + 4}
        </Text>
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
            width: width * 0.75,
            padding: 10,
            borderRadius: 15,
            elevation: 5,
            height: 37,
          }}
        >
          <Text style={{ fontFamily: "Poppins-Regular", fontSize: 12 }}>
            {item.name}
          </Text>
          <Text style={{ fontFamily: "Poppins-Regular", fontSize: 12 }}>
            {item.currentScore}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "rgba(47, 86, 248, 0.8)",
          "rgba(199, 47, 248, 0.25)",
          "#E4E7EB",
        ]}
        locations={[0.15, 0.75, 1]}
        style={{
          width: width,
          height: 85,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ width: width, height: StatusBarHeight }} />
        <Text style={{ fontFamily: "Poppins-Regular", fontSize: 24 }}>
          Leaderboard
        </Text>
      </LinearGradient>

      <View
        style={{
          width: width,
          height: height * 0.25,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            resizeMode="contain"
            style={{ width: 85, height: 85 }}
            source={require("../assets/2nd-icon.png")}
          />

          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {topThree[1] !== undefined ? topThree[1].name : "N/A"}
          </Text>
          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {topThree[1] !== undefined ? topThree[1].currentScore : "N/A"}
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Image
            resizeMode="contain"
            style={{ width: 115, height: 115 }}
            source={require("../assets/1st-icon.png")}
          />

          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {topThree[0] !== undefined ? topThree[0].name : "N/A"}
          </Text>
          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {topThree[0] !== undefined ? topThree[0].currentScore : "N/A"}
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Image
            resizeMode="contain"
            style={{ width: 85, height: 85 }}
            source={require("../assets/3rd-icon.png")}
          />

          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {topThree[2] !== undefined ? topThree[2].name : "N/A"}
          </Text>
          <Text style={{ fontFamily: "Poppins-Regular" }}>
            {topThree[2] !== undefined ? topThree[2].currentScore : "N/A"}
          </Text>
        </View>
      </View>

      <View style={{ width: width, flex: 1 }}>
        <FlatList
          data={highScoreList}
          renderItem={renderItem}
          keyExtractor={(item) => highScoreList.indexOf(item)}
        />
      </View>

      <LinearGradient
        colors={[
          "#E4E7EB",
          "rgba(199, 47, 248, 0.25)",
          "rgba(47, 86, 248, 0.8)",
        ]}
        locations={[0.1, 0.5, 1]}
        style={{
          width: width,
          height: 85,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            source={require("../assets/buttons/home-button.png")}
            resizeMode="contain"
            style={{ width: 60, height: 60, marginTop: 20, marginLeft: 20 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleSubview}>
          <Image
            source={require("../assets/buttons/score-button.png")}
            resizeMode="contain"
            style={{ width: 80, height: 80 }}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
          <Image
            source={require("../assets/buttons/sign-out-button.png")}
            resizeMode="contain"
            style={{ width: 60, height: 60, marginTop: 20, marginRight: 20 }}
          />
        </TouchableOpacity>
      </LinearGradient>

      <Animated.View
        style={[styles.subView, { transform: [{ translateY: bounceValue }] }]}
      >
        <Pressable
          onPress={() => {
            toggleSubview();
          }}
          style={{ flex: 6, backgroundColor: "transparent" }}
        ></Pressable>
        <BlurView
          intensity={37}
          tint="dark"
          style={{ alignItems: "center", height: 200 }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Poppins-Regular",
              fontSize: 24,
            }}
          >
            My Points
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: 150,
              height: 150,
            }}
          >
            <Image
              resizeMode="contain"
              style={{ width: 150, height: 150 }}
              source={require("../assets/score-circle.png")}
            />
            <Text
              style={{
                position: "absolute",
                top: 150 * 0.325,
                fontSize: 36,
              }}
            >
              {currentScore}
            </Text>
          </View>
        </BlurView>
        <Pressable
          onPress={() => {
            toggleSubview();
          }}
          style={{ flex: 1, backgroundColor: "transparent" }}
        ></Pressable>
      </Animated.View>
    </View>
  );
};

export default Score;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4E7EB",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
  },
  button: {
    marginBottom: 20,
  },
  subView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    height: height,
  },
});
