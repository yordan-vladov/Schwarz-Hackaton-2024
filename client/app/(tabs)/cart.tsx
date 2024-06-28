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

export default Cart;
