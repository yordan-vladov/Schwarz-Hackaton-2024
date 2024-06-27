import { useAuth } from "@/providers/AuthProvider";
import Icon from "../../components/Icon";
import { Link, Redirect, Stack } from "expo-router";
import { CartProvider } from "@/providers/CartProvider";

const headerProfileButton = () => {
  return (
    <Link href="profile" style={{ marginRight: 20 }}>
      <Icon library="FontAwesome" name="user" size={24} color="#FCF7F8" />
    </Link>
  );
};

function AuthLayout() {
  const { user } = useAuth();

  return user ? (
    <Stack>
      <CartProvider>
        <Stack.Screen
          name="index"
          options={{
            title: "ALL PRODUCTS",
            headerRight: headerProfileButton,
            headerTitleAlign: "center",
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
            title: "Map",
            headerRight: headerProfileButton,
            headerStyle: {
              backgroundColor: "#009FB7",
            },
            headerTintColor: "#FCF7F8",
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            title: "Cart",
            headerRight: headerProfileButton,
            headerStyle: {
              backgroundColor: "#009FB7",
            },
            headerTintColor: "#FCF7F8",
          }}
        />
      </CartProvider>

      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: "#009FB7",
          },
          headerTintColor: "#FCF7F8",
        }}
      />
    </Stack>
  ) : (
    <Redirect href="/(auth)/sign-in" />
  );
}

export default AuthLayout;
