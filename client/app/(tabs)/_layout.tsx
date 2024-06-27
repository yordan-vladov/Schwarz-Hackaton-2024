import Icon from "../../components/Icon";
import { Link, Stack } from "expo-router";

const headerProfileButton = () => {
  return (
    <Link href="profile" style={{ marginRight: 20 }}>
      <Icon library="FontAwesome" name="user" size={24} color="#FCF7F8" />
    </Link>
  );
};

function AuthLayout() {
  return (
    <Stack>
        <Stack.Screen
          name="products"
          options={{
            title: "All Products",
            headerRight: headerProfileButton,

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
  );
}

export default AuthLayout;
