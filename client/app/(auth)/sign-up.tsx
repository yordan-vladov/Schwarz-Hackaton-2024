import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import IconInputField from "../../components/IconInputField";
import Icon from "../../components/Icon";
import VisiblityToggle from "../../components/VisibilityToggle";
import { Link } from "expo-router";

export default function App() {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const handleNameChange = (text: string) => {
    setCredentials({ ...credentials, username: text });
  };

  const handleEmailChange = (text: string) => {
    setCredentials({ ...credentials, email: text });
  };

  const handlePasswordChange = (text: string) => {
    setCredentials({ ...credentials, password: text });
  };

  const handleSubmit = () => {
    console.log("Form submitted", credentials);
  };

  const handleCreateNewAccount = () => {
    // Handle create new account logic here
    console.log("Create New Account");
  };

  const usernameField = (
    <IconInputField
      key={"username"}
      value={credentials.username}
      onChangeText={handleNameChange}
      placeholder="Username"
      leftSide={
        <Icon library="FontAwesome" name="user" size={24} color="black" />
      }
      style={styles.input}
    />
  );

  const emailField = (
    <IconInputField
      key={"email"}
      value={credentials.email}
      onChangeText={handleEmailChange}
      placeholder="Email"
      leftSide={
        <Icon library="FontAwesome" name="envelope" size={24} color="black" />
      }
      style={styles.input}
    />
  );

  const passwordField = (
    <IconInputField
      key={"password"}
      value={credentials.password}
      onChangeText={handlePasswordChange}
      placeholder="Password"
      secureTextEntry={passwordVisibility}
      style={styles.input}
      leftSide={
        <Icon library="FontAwesome5" name="lock" size={24} color="black" />
      }
      rightSide={
        <VisiblityToggle
          state={passwordVisibility}
          setState={setPasswordVisibility}
        />
      }
    />
  );

  const fields = [emailField, usernameField, passwordField];
  const [activeFieldKey, setFieldKey] = useState(emailField.key);

  const setActiveFieldToNext = () => {
    switch (activeFieldKey) {
      case "email":
        setFieldKey("username");
        break;
      case "username":
        setFieldKey("password");
        break;
      default:
        break;
    }
  };

  const setActiveFieldToPrevious = () => {
    switch (activeFieldKey) {
      case "password":
        setFieldKey("username");
        break;
      case "username":
        setFieldKey("email");
        break;
      default:
        break;
    }
  };

  const getActiveField = () => {
    return fields.filter((field) => field.key === activeFieldKey);
  };

  const signUpButton = (
    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
      <Text style={styles.buttonText}>SIGN UP</Text>
    </TouchableOpacity>
  );

  const signInButton = (
    <Link asChild href="(auth)/sign-in" style={styles.button}>
      <TouchableOpacity
        style={[styles.button]}
        onPress={handleCreateNewAccount}
      >
        <Text style={styles.buttonText}>I HAVE AN ACCOUNT</Text>
      </TouchableOpacity>
    </Link>
  );

  const nextStepButton = (
    <TouchableOpacity onPress={setActiveFieldToNext}>
      <AntDesign name="right" size={38} color="black" />
    </TouchableOpacity>
  );

  const previousStepButton = (
    <TouchableOpacity onPress={setActiveFieldToPrevious}>
      <AntDesign name="left" size={38} color="black" />
    </TouchableOpacity>
  );

  const stepButtons = (
    <View style={styles.buttonContainer}>
      {activeFieldKey !== "email" ? previousStepButton : null}
      {activeFieldKey !== "password" ? nextStepButton : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>
            F
            <Icon
              library="FontAwesome"
              name="map-marker"
              size={30}
              color="red"
            />
            NDR
          </Text>
          <View style={styles.inputContainer}>
            {getActiveField()}
            {stepButtons}
            {activeFieldKey === "password" && signUpButton}
            <View style={styles.separatorContainer}>
              <View style={styles.separator} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separator} />
            </View>
            {signInButton}
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
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#009fb7",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    color: "white",
  },
  buttonText: {
    fontFamily: "JosefineSansBold",
    color: "white",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 50,
    margin: 50,
  },
  separatorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
    margin: 20,
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
