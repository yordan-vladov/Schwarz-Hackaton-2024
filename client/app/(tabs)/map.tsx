import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
} from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Icon from "../../components/Icon";
import { useAxios } from "../../services/api";
import { useAuth } from "../../providers/AuthProvider";
import axios from "axios";
import qs from "qs";
import { consumables } from "@/constants/Categories";
import { useCart } from "@/providers/CartProvider";
import { router } from "expo-router";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const gridRows = 20;
const gridCols = 40;
const squareSize = (screenWidth / gridCols) * 0.8;

export default function ZoomableMap() {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const sensitivityFactor = useSharedValue(1);

  interface MapObject {
    itemDetails: any[][];
    address: string;
    description: string;
    id: number;
  }

  const [mapObjects, setMapObjects] = useState<MapObject | undefined>();
  const [pathObjects, setPathObjects] = useState<
    | {
        distance: number;
        pathfind: any[];
        sorted: any[];
      }
    | undefined
  >();

  const { refreshAccessToken, signOut } = useAuth();
  const { cart, clearCart } = useCart();

  const axiosInstance = useAxios(refreshAccessToken, signOut);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = cart.map((product) => `P${product.productId}`);
        const pathDataPromise = axiosInstance.get("pathfind/1", {
          params: { products: products.join(",") },
          paramsSerializer: (params) => qs.stringify(params),
        });
        const productDataPromise = axiosInstance.get("store/1", {});
        const [pathData, productData] = await Promise.all([
          pathDataPromise,
          productDataPromise,
        ]);

        setPathObjects(pathData.data);
        setMapObjects(productData.data);
        console.log(pathData.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error(error.response.data);
        }
      }
    };

    fetchData();
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      if (event.y <= screenHeight / 2) {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    })
    .onUpdate((event) => {
      if (event.y <= screenHeight / 2) {
        translateX.value =
          savedTranslateX.value + event.translationX * sensitivityFactor.value;
        translateY.value =
          savedTranslateY.value + event.translationY * sensitivityFactor.value;
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      if (event.focalY <= screenHeight / 2) {
        scale.value = Math.max(1, savedScale.value * event.scale);
        sensitivityFactor.value = 1 / scale.value;
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const handleRecenter = () => {
    scale.value = withTiming(1);
    savedScale.value = 1;
    sensitivityFactor.value = 1;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const handleFinish = () => {
    clearCart();
    router.navigate("(tabs)");
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const drawCols = () => {
    return Array.from({ length: gridCols }, (_, x) => (
      <View
        key={`col-${x}`}
        style={{
          width: squareSize,
          height: squareSize,
          borderWidth: 0.5,
          borderColor: "rgba(0, 0, 0, 0.1)",
        }}
      />
    ));
  };

  const drawRows = () => {
    return Array.from({ length: gridRows }, (_, y) => (
      <View key={`row-${y}`} style={{ flexDirection: "row" }}>
        {drawCols()}
      </View>
    ));
  };

  const drawSquares = () => {
    let squares: React.JSX.Element[] = [];

    if (mapObjects && mapObjects.itemDetails) {
      for (let y = 0; y < gridRows + 1; y++) {
        for (let x = 0; x < gridCols + 1; x++) {
          const item =
            mapObjects.itemDetails[x] && mapObjects.itemDetails[x][y];
          if (item) {
            squares.push(
              <View
                key={`red-square-${x}-${y}`}
                style={{
                  width: squareSize,
                  height: squareSize,
                  backgroundColor:
                    item.category === "Entry"
                      ? "#98ff98"
                      : item.category === "Exit"
                      ? "#ff5c5c"
                      : item.category === "BlockedPath"
                      ? "red"
                      : item.category === "Checkout"
                      ? "yellow"
                      : consumables.includes(item.category)
                      ? "#d7a1f9"
                      : "#caf0f8",
                  position: "absolute",
                  bottom: y * squareSize - squareSize / 2,
                  left: x * squareSize - squareSize / 2,
                  borderRadius: 1,
                  borderWidth: 0.5,
                }}
              />
            );
          }
        }
      }
    }

    return squares;
  };

  const drawPath = () => {
    let lines: React.JSX.Element[] = [];
    let circles: React.JSX.Element[] = [];

    const orientationStyles = StyleSheet.create({
      horizontal: {
        width: squareSize,
        height: squareSize / 4,
      },
      vertical: {
        width: squareSize / 4,
        height: squareSize,
      },
      diagonal: {
        width: Math.sqrt(2 * Math.pow(squareSize, 2)),
        height: squareSize / 4,
      },
    });

    type RotateType = { rotate: string };

    if (pathObjects) {
      pathObjects.pathfind.forEach((segment, segmentIndex) => {
        const segmentPositions = [segment.start, ...segment.path, segment.end];

        segmentPositions.forEach((pos, index) => {
          if (index + 1 !== segmentPositions.length) {
            const nextPos = segmentPositions[index + 1];
            let style = {};
            let rotate: RotateType = { rotate: "0deg" };
            const anchorX = Math.sqrt(2 * Math.pow(squareSize, 2)) / 2;
            const anchorY = squareSize / 64;

            // HORIZONTAL LINES
            if (nextPos.y === pos.y) {
              if (nextPos.x > pos.x) {
                style = {
                  ...orientationStyles.horizontal,
                  bottom: pos.y * squareSize - squareSize / 8,
                  left: pos.x * squareSize,
                };
              } else {
                style = {
                  ...orientationStyles.horizontal,
                  bottom: pos.y * squareSize - squareSize / 8,
                  left: nextPos.x * squareSize,
                };
              }
              // VERTICAL LINES
            } else if (nextPos.x === pos.x) {
              if (nextPos.y > pos.y) {
                style = {
                  ...orientationStyles.vertical,
                  bottom: pos.y * squareSize - squareSize / 64,
                  left: pos.x * squareSize - squareSize / 8,
                };
              } else {
                style = {
                  ...orientationStyles.vertical,
                  bottom: nextPos.y * squareSize - squareSize / 64,
                  left: pos.x * squareSize - squareSize / 8,
                };
              }
              // DIAGONAL LINES
            } else {
              style = {
                ...orientationStyles.diagonal,
                bottom: pos.y * squareSize - squareSize / 8,
                left: pos.x * squareSize,
              };

              if (nextPos.y > pos.y && nextPos.x > pos.x) {
                rotate = { rotate: `-45deg` };
              } else if (nextPos.y > pos.y && nextPos.x < pos.x) {
                rotate = { rotate: `-135deg` };
              } else if (nextPos.y < pos.y && nextPos.x > pos.x) {
                rotate = { rotate: `45deg` };
              } else if (nextPos.y < pos.y && nextPos.x < pos.x) {
                rotate = { rotate: `135deg` };
              }
            }

            lines.push(
              <View
                key={`line-${segmentIndex}-${index}`}
                style={[
                  style,
                  {
                    borderRadius: 5,
                    backgroundColor: "green",
                    position: "absolute",
                    transform: [
                      { translateX: -anchorX },
                      { translateY: -anchorY },
                      rotate,
                      { translateY: anchorY },
                      { translateX: anchorX },
                    ],
                  },
                ]}
              />
            );
          }
        });

        // Draw yellow circle at end position
        const endPos = segment.end;
        circles.push(
          <View
            key={`circle-${segmentIndex}`}
            style={{
              width: squareSize / 2,
              height: squareSize / 2,
              backgroundColor: "yellow",
              borderRadius: squareSize / 4,
              position: "absolute",
              bottom: endPos.y * squareSize - squareSize / 4,
              left: endPos.x * squareSize - squareSize / 4,
            }}
          />
        );
      });

      return [...lines, ...circles];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <GestureDetector
          gesture={Gesture.Simultaneous(panGesture, pinchGesture)}
        >
          <View style={[styles.upperHalf, { height: screenWidth }]}>
            <Text style={styles.distance}>
              ДИСТАНЦИЯ: {pathObjects && pathObjects.distance}
            </Text>
            {mapObjects && pathObjects ? (
              <Animated.View style={[styles.content, animatedStyle]}>
                <View style={{ ...styles.innerView }}>
                  {drawRows()}
                  {drawSquares()}
                  {drawPath()}
                </View>
              </Animated.View>
            ) : (
              <View>
                <Text style={styles.distance}>ЗАРЕЖДАНЕ...</Text>
              </View>
            )}

            <TouchableOpacity style={styles.recenter} onPress={handleRecenter}>
              <Icon
                library="FontAwesome6"
                name="down-left-and-up-right-to-center"
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.finish} onPress={handleFinish}>
              <Icon library="FontAwesome6" name="check" color="white" />
            </TouchableOpacity>
          </View>
        </GestureDetector>
        <ScrollView style={styles.lowerHalf}>
          {pathObjects &&
            pathObjects.sorted.map((product) =>
              product ? (
                <View key={product.productId} style={styles.product}>
                  <View style={styles.productData}>
                    <Image
                      source={{ uri: product.imageUri }}
                      style={styles.image}
                    />
                    <View style={styles.info}>
                      <Text style={styles.productText}>{product.name}</Text>
                    </View>
                  </View>
                </View>
              ) : null
            )}
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    display: "flex",
    flexDirection: "column",
  },
  productData: {
    display: "flex",
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
  distance: {
    top: 30,
    fontFamily: "JosefineSansBold",
  },
  product: {
    width: "95%",
    height: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FCF7F8",
    borderRadius: 10,
    padding: 10,
    borderColor: "#009FB7",
    borderWidth: 1,
    marginBottom: 20,
    display: "flex",
    margin: 10,
  },
  productText: {
    fontSize: 18,
    color: "#009FB7",
  },
  price: {},
  gestureContainer: {
    flex: 1,
  },
  upperHalf: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  lowerHalf: {
    flex: 1,
    backgroundColor: "#eee",
  },
  content: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  innerView: {
    position: "relative",
    width: "auto",
    height: "auto",
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  recenter: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  finish: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "green",
    justifyContent: "center",
  },
});
