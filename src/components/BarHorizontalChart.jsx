import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop } from "react-native-svg";

export default function BarHorizontalChart({ data }) {
    const chartWidth = Dimensions.get("window").width - 40;
    const barHeight = 30;
    const chartHeight = data.cities.length * (barHeight + 20);
    const totalRecords = data.counts.reduce((acc, count) => acc + count, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registros por Municipio</Text>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Svg width={chartWidth} height={chartHeight}>
                    <Defs>
                        <LinearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0%" stopColor="#00bfa5" />
                            <Stop offset="100%" stopColor="#00897b" />
                        </LinearGradient>
                    </Defs>

                    {data.cities.map((city, index) => {
                        const percentage = (data.counts[index] / totalRecords) * 100;
                        const barWidth = (percentage / 100) * chartWidth;

                        return (
                            <React.Fragment key={city}>
                                <Rect
                                    x={20}
                                    y={index * (barHeight + 20)}
                                    width={chartWidth - 40}
                                    height={barHeight}
                                    fill="#e0e0e0"
                                    rx="10"
                                    ry="10"
                                />

                                <Rect
                                    x={20}
                                    y={index * (barHeight + 20)}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="url(#barGradient)"
                                    rx="10"
                                    ry="10"
                                />

                                <SvgText
                                    x="25"
                                    y={index * (barHeight + 20) + barHeight / 1.6}
                                    fill="#000000"
                                    fontSize="12"
                                    fontWeight="bold"
                                    alignmentBaseline="middle"
                                    textAnchor="start"
                                >
                                    {city.toUpperCase()}
                                </SvgText>

                                <SvgText
                                    x={chartWidth - 45}
                                    y={index * (barHeight + 20) + barHeight / 1.6}
                                    fill="#000000"
                                    fontSize="12"
                                    fontWeight="bold"
                                    alignmentBaseline="middle"
                                    textAnchor="end"
                                >
                                    {data.counts[index]}
                                </SvgText>
                            </React.Fragment>
                        );
                    })}
                </Svg>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 15,
        maxHeight: 260,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#333333",
    },
});