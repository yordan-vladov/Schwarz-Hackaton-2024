<<<<<<< Updated upstream
import { Link } from "expo-router";
import { View, Text } from "react-native";
import {useCart} from "@/providers/CartProvider";

const Cart = () => {
  const {cart } = useCart();
  console.log(cart);
  return (
    <View>
      <Link href="map">
        <Text>GO TO MAP</Text>
      </Link>
    </View>
  );
};

=======
import React from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "../../components/Icon";
import IconInputField from "../../components/IconInputField";
import { FontAwesome } from "@expo/vector-icons";

const Cart = () => {
  const goToMap = () => {
    const params = {
      message: "Hello World!",
    };
    router.push({ pathname: "map", params: params });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchField}>
        <IconInputField
          placeholder="Search"
          style={styles.searchInput}
          leftSide={<FontAwesome name="search" size={24} color="black" />}
        />
      </View>
      <View style={styles.product}>
        <View style={styles.productData}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.image}
          />
          <View style={styles.info}>
            <Text style={styles.productText}>Product 1</Text>
            <Text style={styles.price}>Price</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.deleteIcon}>
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Pressable onPress={goToMap} style={styles.cartButton}>
        <View style={styles.cart}>
          <Icon library="FontAwesome" name="map" size={30} color={"#FCF7F8"} />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FCF7F8",
  },
  info: {
    display: "flex",
    flexDirection: "column",
  },
  productData: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productInfo: {
    display: "flex",
    flexDirection: "row",
  },
  image: {
    height: 50,
    width: 50,
  },
  product: {
    width: "80%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    borderColor: "#009FB7",
    borderWidth: 1,
    marginBottom: 20,
    display: "flex",
  },
  productText: {
    fontSize: 18,
    color: "#009FB7",
  },
  deleteIcon: {
    paddingHorizontal: 10,
  },
  searchField: {
    height: 60,
    paddingHorizontal: 20,
    width: "100%",
    backgroundColor: "#fcf7f8",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  searchInput: {
    width: "90%",
    height: 50,
    fontSize: 18,
    color: "#009FB7",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderBottomColor: "#009FB7",
    borderWidth: 2,
    borderColor: "transparent",
  },
  price: {},
  cartButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  cart: {
    width: 60,
    height: 60,
    backgroundColor: "#009FB7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

>>>>>>> Stashed changes
export default Cart;
