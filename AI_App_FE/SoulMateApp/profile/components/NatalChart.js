// import React from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';
// import { useSelector } from 'react-redux';
// import AppButton from '../../components/AppButton';
// import { useNavigation } from '@react-navigation/native';

// export default function NatalChart() {
//   const navigation = useNavigation();

//   // Lấy ảnh từ Redux store
//   const { natalChartImage } = useSelector((state) => state.profile);
//   const defaultNatalChartImage = require('../../assets/default_natal_chart_image.jpg');

//   return (
//     <View style={styles.container}>
//       {/* Header: title + button */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Bản đồ sao</Text>
//         <AppButton
//           buttonTitle="Xem phân tích"
//           color='#478ae8'
//           fontSize={14}
//           backgroundColor="#000"
//           borderColor='#478ae8'
//           borderWidth={1}
//           borderRadius={22}
//           onPress={() => navigation.navigate('NatalChartAnalysis')}
//         />
//       </View>

//       {/* Image */}
//       <Image
//         source={
//           natalChartImage
//             ? { uri: natalChartImage }
//             : defaultNatalChartImage
//         }
//         style={styles.image}
//         resizeMode="cover"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 22,
//     paddingHorizontal: 32,
//     marginTop: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 22,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   image: {
//     width: '100%',
//     height: 600,
//     borderRadius: 16,
//   },
// });

// ...existing code...
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
// ...existing code...

export default function NatalChart() {
  const navigation = useNavigation();

  // Lấy ảnh từ Redux store
  const { natalChartImage } = useSelector((state) => state.profile);
  const defaultNatalChartImage = require('../../assets/default_natal_chart_image.jpg');

  // New state for handling SVG -> PNG conversion
  const [displayImageUri, setDisplayImageUri] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const svgRef = useRef(null);
  const [svgXml, setSvgXml] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function ensureImage() {
      setLoadingImage(true);
      setDisplayImageUri(null);
      setSvgXml(null);

      try {
        // If no natalChartImage, use default asset
        if (!natalChartImage) {
          if (mounted) setDisplayImageUri(null); // fallback to default below
          setLoadingImage(false);
          return;
        }

        // Determine if payload is SVG content or SVG URL
        const isSvgString = typeof natalChartImage === 'string' && natalChartImage.trim().startsWith('<svg');
        const isDataSvg = typeof natalChartImage === 'string' && natalChartImage.startsWith('data:image/svg+xml');
        const isSvgUrl = typeof natalChartImage === 'string' && natalChartImage.toLowerCase().endsWith('.svg');

        let svgContent = null;
        if (isSvgString) {
          svgContent = natalChartImage;
        } else if (isDataSvg) {
          // data URI -> extract svg xml portion
          const commaIndex = natalChartImage.indexOf(',');
          svgContent = commaIndex >= 0 ? decodeURIComponent(natalChartImage.slice(commaIndex + 1)) : natalChartImage;
        } else if (isSvgUrl) {
          // fetch remote svg text
          const res = await fetch(natalChartImage);
          svgContent = await res.text();
        }

        if (svgContent) {
          // set xml for SvgXml renderer, then capture it to PNG
          if (!mounted) return;
          setSvgXml(svgContent);

          // allow one render frame for SvgXml to mount
          requestAnimationFrame(async () => {
            try {
              // captureRef of the view containing the SVG
              const uri = await captureRef(svgRef, {
                format: 'png',
                quality: 1,
                result: 'tmpfile', // returns a file URI usable by <Image>
              });
              if (mounted) setDisplayImageUri(uri);
            } catch (err) {
              console.warn('SVG -> PNG capture failed', err);
            } finally {
              if (mounted) setLoadingImage(false);
            }
          });
          return;
        }

        // Not an SVG (likely png/jpg URL or base64) — just display directly
        if (mounted) {
          setDisplayImageUri(natalChartImage);
          setLoadingImage(false);
        }
      } catch (err) {
        console.warn('Error preparing natal chart image', err);
        if (mounted) setLoadingImage(false);
      }
    }

    ensureImage();

    return () => {
      mounted = false;
    };
  }, [natalChartImage]);

  return (
    <View style={styles.container}>
      {/* Header: title + button */}
      <View style={styles.header}>
        <Text style={styles.title}>Bản đồ sao</Text>
        <AppButton
          buttonTitle="Xem phân tích"
          color='#478ae8'
          fontSize={14}
          backgroundColor="#000"
          borderColor='#478ae8'
          borderWidth={1}
          borderRadius={22}
          onPress={() => navigation.navigate('NatalChartAnalysis')}
        />
      </View>

      {/* Hidden SVG renderer used to capture PNG when natal chart is SVG */}
      {svgXml ? (
        <View
          ref={svgRef}
          style={{
            position: 'absolute',
            left: -9999,
            width: '100%',
            height: 600,
            // ensure background if your svg uses transparency
            backgroundColor: 'transparent',
          }}
          collapsable={false}
        >
          <SvgXml xml={svgXml} width="100%" height="100%" />
        </View>
      ) : null}

      {/* Image or loader */}
      <View>
        {loadingImage ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <Image
            source={
              displayImageUri
                ? { uri: displayImageUri }
                : defaultNatalChartImage
            }
            style={styles.image}
            resizeMode="cover"
          />
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
  image: {
    width: '100%',
    height: 600,
    borderRadius: 16,
  },
});
// ...existing code...