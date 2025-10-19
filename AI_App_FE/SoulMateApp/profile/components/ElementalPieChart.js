// src/components/ElementalPieChart.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { PieChart } from 'react-native-chart-kit';

const ElementalPieChart = () => {
  const { fireRatio, earthRatio, airRatio, waterRatio } = useSelector(
    (state) => state.profile
  );

  // Dữ liệu cho biểu đồ
  const data = [
    {
      name: 'Hỏa',
      ratio: fireRatio || 0,
      color: '#FF6B6B',
      legendFontColor: '#fff',
      legendFontSize: 14,
    },
    {
      name: 'Thổ',
      ratio: earthRatio || 0,
      color: '#8B4513',
      legendFontColor: '#fff',
      legendFontSize: 14,
    },
    {
      name: 'Khí',
      ratio: airRatio || 0,
      color: '#4ECDC4',
      legendFontColor: '#fff',
      legendFontSize: 14,
    },
    {
      name: 'Thủy',
      ratio: waterRatio || 0,
      color: '#4A90E2',
      legendFontColor: '#fff',
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#000',
    backgroundGradientTo: '#000',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const screenWidth = Dimensions.get('window').width;

  // Kiểm tra nếu tất cả tỷ lệ đều = 0
  const hasData = data.some((item) => item.ratio > 0);

  return (
    <View style={styles.container}>
      {hasData ? (
        <>
          <PieChart
            data={data}
            width={screenWidth - 64}
            height={346}
            chartConfig={chartConfig}
            accessor="ratio"
            backgroundColor="transparent"
            center={[110, 0]}
            absolute
            hasLegend={false}
          />

          {/* Chú thích tùy chỉnh với % */}
          <View style={styles.legendContainer}>
            {data.map((item, index) => (
              <View key={index} style={styles.legendRow}>
                <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>
                  {item.name}: {item.ratio}%
                </Text>
              </View>
            ))}
          </View>

          {/* Bottom line */}
          <View style={styles.bottomLine} />
        </>
      ) : (
        <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Chưa có dữ liệu tỷ lệ nguyên tố</Text>
          </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    backgroundColor: '#000',
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    gap: 5,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '26%',
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default ElementalPieChart;