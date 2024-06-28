import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
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
import qs from "qs";
import { consumables } from "@/constants/Categories";

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
    { pathfind: any[] } | undefined
  >();

  const { refreshAccessToken, signOut } = useAuth();

  const axiosInstance = useAxios(refreshAccessToken, signOut);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let products = [
          "P1",
          "P10",
          "P100",
          "P101",
          "P102",
          "P103",
          "P104",
          "P105",
          "P106",
          "P108",
          "P109",
          "P11",
          "P110",
          "P111",
          "P112",
          "P113",
          "P114",
          "P115",
          "P116",
          "P117",
          "P118",
          "P119",
          "P12",
          "P120",
          "P121",
          "P122",
          "P123",
          "P124",
          "P125",
          "P126",
          "P127",
          "P128",
          "P129",
          "P13",
          "P130",
          "P131",
          "P132",
          "P133",
          "P134",
          "P135",
          "P136",
          "P137",
          "P138",
          "P139",
          "P14",
          "P140",
          "P141",
          "P142",
          "P143",
          "P144",
          "P145",
          "P146",
          "P147",
          "P148",
          "P149",
          "P15",
          "P150",
          "P151",
          "P152",
          "P153",
          "P154",
          "P155",
          "P156",
          "P157",
          "P158",
          "P159",
          "P16",
          "P160",
          "P161",
          "P162",
          "P163",
          "P164",
          "P165",
          "P166",
          "P167",
          "P168",
          "P169",
          "P17",
          "P170",
          "P171",
          "P172",
          "P173",
          "P174",
          "P175",
          "P176",
          "P177",
          "P178",
          "P179",
          "P18",
          "P180",
          "P181",
          "P182",
          "P183",
          "P184",
          "P185",
          "P186",
          "P187",
          "P188",
          "P189",
          "P190",
          "P191",
          "P196",
          "P197",
          "P198",
          "P199",
          "P2",
          "P20",
          "P200",
          "P201",
          "P202",
          "P203",
          "P205",
          "P206",
          "P207",
          "P208",
          "P209",
          "P21",
          "P210",
          "P211",
          "P212",
          "P213",
          "P214",
          "P215",
          "P216",
          "P217",
          "P218",
          "P219",
          "P22",
          "P220",
          "P221",
          "P222",
          "P223",
          "P224",
          "P225",
          "P226",
          "P227",
          "P228",
          "P229",
          "P23",
          "P230",
          "P231",
          "P232",
          "P233",
          "P234",
          "P235",
          "P236",
          "P237",
          "P238",
          "P239",
          "P24",
          "P240",
          "P241",
          "P242",
          "P243",
          "P244",
          "P245",
          "P246",
          "P247",
          "P248",
          "P249",
          "P25",
          "P250",
          "P251",
          "P252",
          "P253",
          "P254",
          "P255",
          "P256",
          "P257",
          "P258",
          "P259",
          "P26",
          "P260",
          "P261",
          "P262",
          "P263",
          "P264",
          "P265",
          "P266",
          "P267",
          "P268",
          "P269",
          "P27",
          "P270",
          "P271",
          "P272",
          "P273",
          "P274",
          "P275",
          "P276",
          "P277",
          "P278",
          "P28",
          "P280",
          "P281",
          "P282",
          "P283",
          "P284",
          "P285",
          "P286",
          "P287",
          "P288",
          "P289",
          "P29",
          "P290",
          "P291",
          "P292",
          "P293",
          "P294",
          "P295",
          "P296",
          "P297",
          "P298",
          "P299",
          "P3",
          "P30",
          "P300",
          "P301",
          "P302",
          "P303",
          "P304",
          "P305",
          "P306",
          "P307",
          "P308",
          "P309",
          "P31",
          "P311",
          "P312",
          "P313",
          "P314",
          "P315",
          "P316",
          "P317",
          "P318",
          "P319",
          "P32",
          "P33",
          "P34",
          "P35",
          "P36",
          "P37",
          "P38",
          "P39",
          "P4",
          "P40",
          "P41",
          "P42",
          "P43",
          "P44",
          "P45",
          "P46",
          "P47",
          "P48",
          "P49",
          "P5",
          "P50",
          "P51",
          "P52",
          "P53",
          "P54",
          "P55",
          "P56",
          "P57",
          "P58",
          "P59",
          "P6",
          "P60",
          "P61",
          "P62",
          "P63",
          "P64",
          "P65",
          "P66",
          "P67",
          "P68",
          "P7",
          "P73",
          "P74",
          "P75",
          "P76",
          "P77",
          "P78",
          "P79",
          "P8",
          "P80",
          "P81",
          "P82",
          "P83",
          "P84",
          "P87",
          "P88",
          "P89",
          "P9",
          "P90",
          "P91",
          "P92",
          "P93",
          "P94",
          "P95",
          "P96",
          "P97",
          "P98",
          "P99"
        ];
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
            <Animated.View style={[styles.content, animatedStyle]}>
              <View style={{ ...styles.innerView }}>
                {drawRows()}
                {drawSquares()}
                {drawPath()}
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
