import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import { useAxios } from "../../services/api";
import { useAuth } from "../../providers/AuthProvider";
import axios from "axios";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
const gridRows = 20;
const gridCols = 40;
const squareSize = screenWidth / gridCols * 0.8;
const categoryColors: { [key: string]: string } = {
  Entry: "#98ff98",
  Exit: "#ff5c5c",
  Риба: "#caf0f8",
  Плодове: "#d7a1f9",
  Месо: "",
};

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

  const { refreshAccessToken, signOut } = useAuth();

  const axiosInstance = useAxios(refreshAccessToken, signOut);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = axiosInstance.get("store/1");
        setMapObjects((await response).data);
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

  const drawRedSquares = () => {
    let squares: React.JSX.Element[] = [];

    if (mapObjects && mapObjects.itemDetails) {
      for (let y = 0; y < gridRows + 1; y++) {
        for (let x = 0; x < gridCols + 1; x++) {
          const item = mapObjects.itemDetails[x] && mapObjects.itemDetails[x][y];
          if (item) {
            squares.push(
              <View
                key={`red-square-${x}-${y}`}
                style={{
                  width: squareSize,
                  height: squareSize,
                  backgroundColor: categoryColors[item.category] || "",
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

    const positions = [
      { row: 6, col: 1 },
      { row: 6, col: 2 },
      { row: 6, col: 3 },
      { row: 6, col: 4 },
      { row: 7, col: 5 },
      { row: 7, col: 6},
      { row: 7, col: 7},
      { row: 6, col: 6 },
      { row: 6, col: 7},
      { row: 5, col: 8},
      { row: 5, col: 9},
      { row: 5, col: 10},
      { row: 5, col: 11},
      { row: 4, col: 11},
      { row: 4, col: 12},
    ];

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
      }
    });

    type RotateType = { rotate: string };

    positions.forEach((pos, index) => {
      if (index + 1 !== positions.length) {
        const nextPos = positions[index + 1];
        let style = {};
        let rotate: RotateType = { rotate: "0deg"};
        const anchorX = Math.sqrt(2*Math.pow(squareSize, 2)) / 2;
        const anchorY = squareSize / 64;

        // HORIZONTAL LINES
        if (nextPos.row === pos.row) {
            if(nextPos.col > pos.col) {
              style = {
                ...orientationStyles.horizontal,
                bottom: pos.row * (squareSize) - squareSize / 8,
                left: pos.col * squareSize,
              };
            } else {
              style = {
                ...orientationStyles.horizontal,
                bottom: pos.row * squareSize - squareSize / 8,
                left: nextPos.col * squareSize,
              };
            }
        // VERTICAL LINES
        } else if (nextPos.col === pos.col) {
            if(nextPos.row > pos.row) {
              style = {
                ...orientationStyles.vertical,
                bottom: pos.row * squareSize - squareSize / 64,
                left: pos.col * squareSize  - squareSize / 8,
              };
            } else {
              style = {
                ...orientationStyles.vertical,
                bottom: nextPos.row * squareSize - squareSize / 64,
                left: pos.col * squareSize  - squareSize / 8,
              };
            }
        // DIAGONAL LINES
        } else {
          style = {
            ...orientationStyles.diagonal,
            bottom: pos.row * squareSize - squareSize / 8,
            left: pos.col * squareSize,
          };

          if (nextPos.row > pos.row && nextPos.col > pos.col) {
            rotate = { rotate: `-45deg` }
          } else if (nextPos.row > pos.row && nextPos.col < pos.col) {
            rotate = { rotate: `-135deg` }
          } else if (nextPos.row < pos.row && nextPos.col > pos.col) {
            rotate = { rotate: `45deg` }
          } else if (nextPos.row < pos.row && nextPos.col < pos.col) {
            rotate = { rotate: `135deg` }
          }
        }

        lines.push(
          <View
            key={`line-${index}`}
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

    return lines;
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <GestureDetector
          gesture={Gesture.Simultaneous(panGesture, pinchGesture)}
        >
          <View style={[styles.upperHalf, { height: screenWidth }]}>
            <Animated.View style={[styles.content, animatedStyle]}>
              <View style={{ ...styles.innerView }}>
                {drawRows()}
                {drawPath()}
                {drawRedSquares()}
              </View>
            </Animated.View>
            <TouchableOpacity style={styles.recenter} onPress={handleRecenter}>
              <Icon
                library="FontAwesome6"
                name="down-left-and-up-right-to-center"
                color="black"
              />
            </TouchableOpacity>
          </View>
        </GestureDetector>
        <View style={styles.lowerHalf}>
          {/* Other content for the lower half */}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureContainer: {
    flex: 1,
  },
  upperHalf: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
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
});