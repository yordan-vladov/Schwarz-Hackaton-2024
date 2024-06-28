import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "../../components/Icon";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../providers/AuthProvider";

const ProfilePage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.name}>
          <Text style={styles.heading}>Моят профил</Text>
        </View>
        <View style={styles.info}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.image}
          />
          <Text style={styles.nameText}>{useAuth().user?.username}</Text>
          <Text style={styles.emailText}>{useAuth().user?.email}</Text>
        </View>
        <View style={styles.options}>
          <View style={[styles.option, styles.logout]}>
            <View style={styles.iconContainer}>
              <Ionicons name="exit-outline" size={30} color="red" />
            </View>
            <View style={styles.nameContainer}>
              <Text
                style={[styles.optionText, styles.logout]}
                onPress={useAuth().signOut}
              >
                ИЗЛИЗАНЕ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF7F8",
  },
  screen: {
    backgroundColor: "#FCF7F8",
    alignItems: "center",
  },
  name: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  heading: {
    margin: 20,
    fontSize: 35,
    fontWeight: "bold",
  },
  info: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  emailText: {
    fontSize: 14,
    color: "gray",
  },
  options: {
    width: "100%",
    alignItems: "center",
  },
  option: {
    width: "90%",
    height: 60,
    margin: 15,
    borderRadius: 20,
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#009FB7",
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionText: {
    fontSize: 24,
    color: "#009FB7",
  },
  iconContainer: {
    backgroundColor: "transparent",
  },
  nameContainer: {
    width: "80%",
    backgroundColor: "transparent",
  },
  logout: {
    color: "red",
    borderBottomColor: "red",
  },
});

export default ProfilePage;
