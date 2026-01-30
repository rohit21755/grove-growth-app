import { useUserApi } from "@/hooks/use-user-api";
import { useAuthStore } from "@/store/auth-store";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, {
    Circle,
    Defs,
    G,
    Path,
    Stop,
    LinearGradient as SvgLinearGradient,
    Text as SvgText,
} from "react-native-svg";
import SpinWheelPrizeModal from "./SpinWheelPrizeModal";

const { width } = Dimensions.get("window");
const WHEEL_SIZE = width * 0.65;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2;
const STROKE_WIDTH = 1;
const SEGMENTS = 8;
const HUB_RADIUS = RADIUS * 0.15;

interface Segment {
  label: string;
  gradient: { start: string; middle?: string; end: string };
  value: number;
}

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeModalVisible, setPrizeModalVisible] = useState(false);
  const [prize, setPrize] = useState<{
    label: string;
    value: number;
    points: number;
  } | null>(null);
  const winningSegmentRef = useRef<Segment | null>(null);
  const rotation = useSharedValue(0);
  const { addXP } = useUserApi();

  const segments: Segment[] = [
    {
      label: "Prize 1",
      gradient: { start: "#FFD700", end: "#FFA500" },
      value: 10,
    },
    {
      label: "Prize 2",
      gradient: { start: "#00FF7F", end: "#32CD32" },
      value: 20,
    },
    {
      label: "Prize 3",
      gradient: { start: "#00CED1", end: "#20B2AA" },
      value: 30,
    },
    {
      label: "Prize 4",
      gradient: { start: "#FF6347", end: "#FF4500" },
      value: 40,
    },
    {
      label: "Prize 5",
      gradient: { start: "#FF1493", end: "#C71585" },
      value: 50,
    },
    {
      label: "Prize 6",
      gradient: { start: "#8B0000", end: "#DC143C" },
      value: 60,
    },
    {
      label: "Prize 7",
      gradient: { start: "#9370DB", end: "#8A2BE2" },
      value: 70,
    },
    {
      label: "Prize 8",
      gradient: { start: "#4B0082", end: "#6A5ACD" },
      value: 80,
    },
  ];

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const randomSpins = 5 + Math.random() * 5;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation.value + randomSpins * 360 + randomAngle;

    const normalizedAngle = ((totalRotation % 360) + 360) % 360;
    const segmentAngle = 360 / SEGMENTS;
    const winningSegmentIndex =
      Math.floor((normalizedAngle + 90) / segmentAngle) % SEGMENTS;
    const calculatedWinningSegment = segments[winningSegmentIndex];

    winningSegmentRef.current = calculatedWinningSegment;

    rotation.value = withTiming(
      totalRotation,
      {
        duration: 4000,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(onSpinEnd)();
        }
      },
    );
  };

  const onSpinEnd = async () => {
    setIsSpinning(false);

    const winningSegment = winningSegmentRef.current;

    if (winningSegment) {
      try {
        const result = await addXP(winningSegment.value);
        if (!result) {
          const currentUser = useAuthStore.getState().user;
          if (currentUser) {
            useAuthStore.getState().updateUser({
              ...currentUser,
              xp: (currentUser.xp ?? 0) + winningSegment.value,
            });
          }
        }
      } catch {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().updateUser({
            ...currentUser,
            xp: (currentUser.xp ?? 0) + winningSegment.value,
          });
        }
      }

      setPrize({
        label: winningSegment.label,
        value: winningSegment.value,
        points: winningSegment.value,
      });
      setPrizeModalVisible(true);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const calculateSegmentPath = (index: number): string => {
    const segmentAngle = 360 / SEGMENTS;
    const startAngle = ((index * segmentAngle - 90) * Math.PI) / 180;
    const endAngle = (((index + 1) * segmentAngle - 90) * Math.PI) / 180;

    const innerRadius = HUB_RADIUS + 5;
    const outerRadius = RADIUS - 2;

    const x1Inner = CENTER + innerRadius * Math.cos(startAngle);
    const y1Inner = CENTER + innerRadius * Math.sin(startAngle);

    const x2Inner = CENTER + innerRadius * Math.cos(endAngle);
    const y2Inner = CENTER + innerRadius * Math.sin(endAngle);

    const x1Outer = CENTER + outerRadius * Math.cos(startAngle);
    const y1Outer = CENTER + outerRadius * Math.sin(startAngle);

    const x2Outer = CENTER + outerRadius * Math.cos(endAngle);
    const y2Outer = CENTER + outerRadius * Math.sin(endAngle);

    return `M ${x1Inner} ${y1Inner} L ${x1Outer} ${y1Outer} A ${outerRadius} ${outerRadius} 0 0 1 ${x2Outer} ${y2Outer} L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 0 0 ${x1Inner} ${y1Inner} Z`;
  };

  const calculateTextPosition = (
    index: number,
  ): { x: number; y: number; angle: number } => {
    const segmentAngle = 360 / SEGMENTS;
    const midAngle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);
    const textRadius = RADIUS * 0.65;

    return {
      x: CENTER + textRadius * Math.cos(midAngle),
      y: CENTER + textRadius * Math.sin(midAngle),
      angle: (index + 0.5) * segmentAngle,
    };
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.wheelContainer}>
          <View style={styles.pointerContainer}>
            <Svg width={30} height={30}>
              <Path
                d="M 15 0 L 0 25 L 30 25 Z"
                fill="transparent"
                stroke="#FF6B6B"
                strokeWidth="2"
              />
            </Svg>
          </View>

          <Animated.View style={[styles.wheel, animatedStyle]}>
            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
              <Defs>
                {segments.map((segment, index) => (
                  <SvgLinearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <Stop
                      offset="0%"
                      stopColor={segment.gradient.start}
                      stopOpacity="1"
                    />
                    <Stop
                      offset="100%"
                      stopColor={segment.gradient.end}
                      stopOpacity="1"
                    />
                  </SvgLinearGradient>
                ))}
              </Defs>

              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="#0D0D0D"
                stroke="#1A1A1A"
                strokeWidth={2}
              />

              {segments.map((segment, index) => {
                const textPos = calculateTextPosition(index);
                return (
                  <G key={index}>
                    <Path
                      d={calculateSegmentPath(index)}
                      fill={`url(#gradient-${index})`}
                      stroke="#1A1A1A"
                      strokeWidth={STROKE_WIDTH}
                    />
                    <SvgText
                      x={textPos.x}
                      y={textPos.y}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`}
                      opacity={0.9}
                    >
                      {segment.label}
                    </SvgText>
                  </G>
                );
              })}

              <Circle
                cx={CENTER}
                cy={CENTER}
                r={HUB_RADIUS + 3}
                fill="rgba(255, 255, 255, 0.1)"
              />
              <Circle cx={CENTER} cy={CENTER} r={HUB_RADIUS} fill="#FFFFFF" />
            </Svg>
          </Animated.View>
        </View>

        <TouchableOpacity
          style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
          onPress={spinWheel}
          disabled={isSpinning}
        >
          <LinearGradient
            colors={["#79008C", "#1C519D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.spinButtonGradient}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? "Spinning..." : "SPIN THE WHEEL!"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <SpinWheelPrizeModal
        visible={prizeModalVisible}
        onClose={() => {
          setPrizeModalVisible(false);
          setPrize(null);
        }}
        prize={prize}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  wheelContainer: {
    position: "relative",
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 4,
    borderColor: "#2A2A2A",
    backgroundColor: "#0D0D0D",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  pointerContainer: {
    position: "absolute",
    top: -18,
    left: WHEEL_SIZE / 2 - 15,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "60deg" }],
  },
  spinButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#79008C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 30,
  },
  spinButtonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  spinButtonDisabled: {
    opacity: 0.5,
  },
  spinButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
