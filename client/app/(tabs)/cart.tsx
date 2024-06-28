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
  ScrollView,
} from "react-native";
import Icon from "../../components/Icon";
import { FontAwesome } from "@expo/vector-icons";
import { useCart } from "@/providers/CartProvider";

const Cart = () => {
  const { cart, removeProduct } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {cart.map((product) => (
          <View key={product.productId} style={styles.product}>
            <View style={styles.productData}>
              <Image source={{ uri: product.imageUri }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.productText}>{product.name}</Text>
                <Text style={styles.price}>Цена {product.price} лв.</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => removeProduct(product.productId)}
            >
              <FontAwesome name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Pressable
        onPress={() => router.navigate("map")}
        style={styles.cartButton}
      >
        <View style={styles.cart}>
          <Text
            style={{
              fontFamily: "JosefineSansBold",
              fontSize: 15,
              color: "white",
            }}
          >
            ПОТЪРСИ ПЪТ
          </Text>
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
  scrollView: {
    overflow: "hidden",
    alignItems: "center",
  },
  productData: {
    display: "flex",
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
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
    width: "90%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    borderColor: "#009FB7",
    borderWidth: 1,
    marginTop: 10,
    display: "flex",
  },
  productText: {
    fontSize: 18,
    overflow: "hidden",
    color: "#009FB7",
  },
  deleteIcon: {
    paddingHorizontal: 10,
  },
  price: {},
  cartButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
  },
  cart: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#009FB7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default Cart;
