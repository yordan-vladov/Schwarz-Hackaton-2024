import { Redirect } from "expo-router";
import { useAuth } from "../providers/AuthProvider";
import { Text } from "react-native";

const Index = () => {
  const { user, loading } = useAuth();

  return <Redirect href="(tabs)/products"/>
  if(!loading) {
    return user ? (
      <Redirect href="(tabs)" />
    ) : (
      <Redirect href="/(auth)/sign-in" />
    );
  } else {
    return <Text>Loading</Text>
  }

};

export default Index;
