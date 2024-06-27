import { Link } from "expo-router";
import { View, Text } from "react-native";

const Cart = () => {
  return (
    <View>
      <Link href="map">
        <Text>GO TO MAP</Text>
      </Link>
    </View>
  );
};

export default Cart;
