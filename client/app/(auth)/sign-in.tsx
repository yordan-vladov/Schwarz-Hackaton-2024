import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  Text,
  Button,
} from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import IconInputField from "../../components/IconInputField";
import VisiblityToggle from "../../components/VisibilityToggle";
import Icon from "../../components/Icon";

export default function TabOneScreen() {
  const { signIn } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleEmailChange = (text: string) => {
    setCredentials({ ...credentials, email: text });
  };

  const handlePasswordChange = (text: string) => {
    setCredentials({ ...credentials, password: text });
  };

  const handleSubmit = async () => {
    const response = signIn(credentials.email, credentials.password);
    response.then((data: void | { error: string }) => {
      if (data) {
        console.log(data.error);
        console.log(signIn)
      } else {
        console.log("Successful");
        router.navigate("(tabs)");
      }
    });
  };

  const [passwordVisiblity, setPasswordVisibility] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* <View style={styles.circle} /> */}
        <View style={styles.form}>
          <Text style={styles.title}>F<Icon library="FontAwesome" name="map-marker" size={30} color="red"/>NDR</Text>
          <View style={styles.inputContainer}>
            <IconInputField
              value={credentials.email}
              onChangeText={handleEmailChange}
              placeholder="Email"
              style={styles.input}
              leftSide={
                <Icon
                  library="FontAwesome"
                  name="envelope"
                  size={24}
                  color="black"
                />
              }
            />
            <IconInputField
              value={credentials.password}
              onChangeText={handlePasswordChange}
              placeholder="Password"
              secureTextEntry={passwordVisiblity}
              style={styles.input}
              leftSide={
                <Icon
                  library="FontAwesome5"
                  name="lock"
                  size={24}
                  color="black"
                />
              }
              rightSide={
                <VisiblityToggle
                  state={passwordVisiblity}
                  setState={setPasswordVisibility}
                />
              }
            />
            <View style={styles.actionContainer}>
            <TouchableOpacity style={{...styles.button, marginTop: 20}} onPress={handleSubmit}>
              <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separator} />
            </View>
            <Link asChild href="(auth)/sign-up">
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
              </TouchableOpacity>
            </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fcf7f8",
    overflow: "hidden",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 50,
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontFamily: "JosefineSansBold",
    color: "#009fb7",
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
  },
  button: {
    backgroundColor: "#009fb7",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    color: "white",
  },
  actionContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  circle: {
    position: "absolute",
    top: -300,
    marginHorizontal: "auto",
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "#009fb7",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontFamily: "JosefineSansBold",
    color: "white",
  },
  separatorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
  },
  separator: {
    height: 2,
    width: 100,
    backgroundColor: "gray",
  },
  separatorText: {
    fontFamily: "JosefineSansBold",
    color: "gray",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
