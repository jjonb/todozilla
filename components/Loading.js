import React from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";

import { UIActivityIndicator } from "react-native-indicators";

const Loading = () => {
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
        ></ImageBackground>
      </View>

      <View style={{ width: "100%", height: 120 }}>
        <Image
          style={{ width: "100%", height: 50 }}
          resizeMode={"contain"}
          source={require("../assets/loading_logo.png")}
        />

        <UIActivityIndicator color="black" size={60} />
      </View>

      <View
        style={{
          width: 433,
          height: 250,
          alignItems: "center",
          transform: [{ rotate: "180deg" }],
        }}
      >
        <ImageBackground
          source={require("../assets/logo_circles.png")}
          style={{
            width: 433,
            height: 428,
            left: -125,
            top: -200,
          }}
          resizeMode={"contain"}
        ></ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContainer: {
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 7.5,
    marginBottom: 10,
    elevation: 15,
  },
});

export default Loading;
