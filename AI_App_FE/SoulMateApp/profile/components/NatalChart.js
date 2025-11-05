import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';

export default function NatalChart() {
  const navigation = useNavigation();
  const { natalChartImage } = useSelector((state) => state.profile);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bản đồ sao</Text>
        
        <View style={styles.buttonWrapper}>
          <LinearGradient
            colors={['#ff7bbf', '#b36dff', '#ff7bbf']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.buttonContainer}>
              <AppButton
                buttonTitle="Xem phân tích"
                color='#fff'
                fontSize={14}
                backgroundColor="#000"
                borderWidth={0}
                borderRadius={20}
                onPress={() => navigation.navigate('NatalChartAnalysis')}
              />
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.imageContainer}>
        {natalChartImage && !error ? (
          <>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#478ae8" />
              </View>
            )}
            <SvgUri
              uri={natalChartImage}
              width="100%"
              height={600}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError(true);
                setLoading(false);
              }}
            />
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error ? 'Không thể tải biểu đồ' : 'Chưa có biểu đồ'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 22,
    paddingHorizontal: 32,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  buttonWrapper: {
    // Shadow blur effect (glowing)
    shadowColor: '#ff7acb',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  gradientBorder: {
    borderRadius: 22,
    padding: 2, // Độ dày viền gradient
  },
  buttonContainer: {
    borderRadius: 20,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 600,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#999',
    fontSize: 16,
  },
});