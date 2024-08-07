import { useAuth } from "@/providers/AuthProvider";
import Icon from "../../components/Icon";
import { Link, Redirect, Stack } from "expo-router";
import { CartProvider } from "@/providers/CartProvider";

const headerProfileButton = () => {
  return (
    <Link href="profile" style={{ marginRight: 20 }}>
      <Icon library="FontAwesome" name="user" size={26} color="#FCF7F8" />
    </Link>
  );
};

function AuthLayout() {
  const { user } = useAuth();

  return user ? (
    <CartProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "ПРОДУКТИ",
            headerBackVisible: false,
            headerRight: headerProfileButton,
            headerTitleAlign: "center",
            headerBackButtonMenuEnabled: false,
            headerTitleStyle: {
              fontFamily: "JosefineSansBold",
            },
            headerStyle: {
              backgroundColor: "#009FB7",
            },
            headerTintColor: "#FCF7F8",
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            headerBackVisible: false,
            title: "КАРТА",
            headerStyle: {
              backgroundColor: "#009FB7",
            },
            headerTintColor: "#FCF7F8",
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            title: "КОЛИЧКА",
            headerRight: headerProfileButton,
            headerStyle: {
              backgroundColor: "#009FB7",
            },
            headerTintColor: "#FCF7F8",
          }}
        />

        <Stack.Screen
          name="profile"
          options={{
            title: "ПРОФИЛ",
            headerStyle: {
              backgroundColor: "#009FB7",
            },
            headerTintColor: "#FCF7F8",
          }}
        />
      </Stack>
    </CartProvider>
  ) : (
    <Redirect href="/(auth)/sign-in" />
  );
}

export default AuthLayout;
