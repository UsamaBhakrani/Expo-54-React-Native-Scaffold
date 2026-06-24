import React, { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Svg,
} from "react-native-svg";

export type ChartCardProps = {
  title: string;
  subtitle: string;
  value: string;
  caption: string;
  data: number[];
  color: string;
  style?: ViewStyle;
};

const CARD_WIDTH = 340;
const CHART_HEIGHT = 140;

function formatPath(data: number[]) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const step = CARD_WIDTH / Math.max(data.length - 1, 1);

  const points = data.map((value, index) => {
    const x = index * step;
    const y = CHART_HEIGHT - ((value - min) / range) * CHART_HEIGHT;
    return { x, y };
  });

  const line = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(" ");

  const area = [
    `M ${points[0].x.toFixed(2)} ${CHART_HEIGHT.toFixed(2)}`,
    ...points.map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
    `L ${points[points.length - 1].x.toFixed(2)} ${CHART_HEIGHT.toFixed(2)}`,
    "Z",
  ].join(" ");

  return { line, area, points };
}

export default function ChartCard({
  title,
  subtitle,
  value,
  caption,
  data,
  color,
  style,
}: ChartCardProps) {
  const [activeIndex, setActiveIndex] = useState(data.length - 1);
  const { line, area, points } = useMemo(() => formatPath(data), [data]);

  return (
    <Pressable
      style={[styles.card, style]}
      onPress={() => setActiveIndex((current) => (current + 1) % data.length)}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.value}>{value}</Text>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={CARD_WIDTH} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <Stop offset="100%" stopColor={color} stopOpacity="0.03" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={CARD_WIDTH}
            height={CHART_HEIGHT}
            fill="transparent"
          />
          <Path d={area} fill="url(#gradient)" />
          <Path
            d={line}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={index === activeIndex ? 6 : 4}
              fill={index === activeIndex ? "#fff" : color}
              stroke={color}
              strokeWidth={index === activeIndex ? 2 : 1}
            />
          ))}
        </Svg>
        <View style={styles.tipRow}>
          <Text style={styles.caption}>{caption}</Text>
          <Text style={styles.activeValue}>
            ${data[activeIndex].toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    padding: 20,
    borderRadius: 42,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#a5b4fc",
  },
  value: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  chartContainer: {
    marginTop: 18,
  },
  tipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  caption: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  activeValue: {
    color: "#fff",
    fontWeight: "700",
  },
});
