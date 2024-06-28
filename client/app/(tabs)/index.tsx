import IconInputField from "../../components/IconInputField";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Icon from "../../components/Icon";
import { FontAwesome } from "@expo/vector-icons";
import axios from 'axios'; // Import axios for API requests
import { useCart } from '@/providers/CartProvider';
import {useAuth} from "@/providers/AuthProvider"; // Adjust the path if necessary

interface Product {
  productId: string;
  name: string;
  imageUri: string;
}

interface GroupedProducts {
  [category: string]: Product[];
}

interface ProductListProps {
  category: string;
  products: Product[];
}

const ProductList = ({ category, products }: ProductListProps) => {
  const { cart, addProduct } = useCart();

  const isProductInCart = (productId: string) => {
    return cart.some(product => product.productId === productId);
  };

  const handleAddProduct = (product: Product) => {
    addProduct(product);
  };

  return (
    <View style={styles.category}>
      <Text style={styles.subHeading}>{category}</Text>
      <View style={styles.products}>
        {products.map((item, index) => (
          <View style={styles.product} key={index}>
            <Image source={{ uri: item.imageUri }} style={styles.productImage} />
            <Text style={styles.productText}>{item.name}</Text>
            <TouchableOpacity
            style={[
              styles.addButton,
              isProductInCart(item.productId) && styles.addedButton
            ]}
            onPress={() => handleAddProduct(item)}
            disabled={isProductInCart(item.productId)}

          >
            {isProductInCart(item.productId) ? (
              <Text style={styles.addedText}>ADDED</Text>
            ) : (
              <Icon library="FontAwesome" name="plus" size={20} color="#fff" />
            )}
          </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
  const { accessToken } = useAuth(); // Adjust this according to your authentication setup

  useEffect(() => {
    if (accessToken) {
      fetchProducts();
    } else {
      console.error('No access token available');
    }
  }, [accessToken]);

  const fetchProducts = async () => {
    const apiUrl = `${process.env.EXPO_PUBLIC_HOST}/api/v1/products/grouped-by-categories`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        const productsWithImages: GroupedProducts = {};
        Object.keys(response.data).forEach(category => {
          productsWithImages[category] = response.data[category].map((product: Product) => ({
            ...product,
            imageUri: 'https://via.placeholder.com/50' // Replace with actual imageUri from response
          }));
        });
        setGroupedProducts(productsWithImages);
        console.log(productsWithImages);
      } else {
        console.error('Failed to fetch products:', response.status);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = () => {
    if (!searchQuery) {
      return groupedProducts;
    }

    const filtered: GroupedProducts = {};

    Object.keys(groupedProducts).forEach((category) => {
      const products = groupedProducts[category].filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (products.length > 0) {
        filtered[category] = products;
      }
    });

    return filtered;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.searchField}>
        <IconInputField
          placeholder="Search"
          style={styles.searchInput}
          leftSide={<FontAwesome name="search" size={24} color="black" />}
        />
      </View>
      <View style={styles.name}>
        <Text style={styles.heading}>Products</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {Object.keys(filteredProducts()).map((category) => (
          <ProductList
            key={category}
            category={category}
            products={filteredProducts()[category]}
          />
        ))}
      </ScrollView>
      <Link asChild href="cart">
        <TouchableOpacity style={styles.cart}>
          <Icon
            library="FontAwesome"
            name="shopping-cart"
            size={30}
            color={"#FCF7F8"}
          />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FCF7F8",
  },

  searchField: {
    height: 60,
    paddingHorizontal: 20,
    width: "100%",
    backgroundColor: "#fcf7f8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
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
  placeholderStyle: {
    color: "#009FB7",
  },
  name: {
    width: "100%",
    alignItems: "flex-start",
    backgroundColor: "#FCF7F8",
  },
  heading: {
    margin: 20,
    fontSize: 28,
    fontWeight: "bold",
    backgroundColor: "#FCF7F8",
  },
  scrollView: {
    width: "100%",
  },
  subHeading: {
    marginVertical: 20,
    marginLeft: 30,
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: "#FCF7F8",
  },
  category: {
    width: "100%",
  },
  products: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    backgroundColor: "#FCF7F8",
  },
  product: {
    width: "30%",
    backgroundColor: "#F1F2EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 20,
    borderBottomColor: "#009FB7",
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 20,
  },
  productText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  addButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#009FB7",
    borderRadius: 10,
    marginBottom: 5,
    width: 60,
    height: 30,
  },
  addedButton: {
    backgroundColor: "#00C851", // Change color to indicate the item is added
  },
  addedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cart: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#009FB7",
    width: 60,
    height: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default Products;
