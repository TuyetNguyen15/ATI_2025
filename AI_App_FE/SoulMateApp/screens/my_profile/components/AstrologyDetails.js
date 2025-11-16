// src/components/AstrologyDetails.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PlanetsInfo from './PlanetsInfo';
import ElementalPieChart from './ElementalPieChart';
import HousesInfo from './HousesInfo';
import AspectsInfo from './AspectsInfo';

const AstrologyDetails = () => {
  const [expandedSections, setExpandedSections] = useState([]);

  const sections = [
    { id: 'planets', title: 'Hành tinh', component: PlanetsInfo },
    { id: 'elements', title: 'Tỷ lệ nguyên tố', component: ElementalPieChart },
    { id: 'houses', title: 'Các nhà', component: HousesInfo },
    { id: 'aspects', title: 'Góc chiếu', component: AspectsInfo },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Chi tiết chiêm tinh</Text>
      
      {sections.map((section) => {
        const Component = section.component;
        const isExpanded = expandedSections.includes(section.id);

        return (
          <View key={section.id} style={styles.sectionWrapper}>
            {/* Gradient Border với Shadow Blur */}
            <LinearGradient
              colors={['#ff7bbf', '#b36dff', '#ff7bbf']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            >
              <View style={styles.section}>
                {/* Header với Gradient Background */}
                <TouchableOpacity
                  onPress={() => toggleSection(section.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#ff7bbf', '#b36dff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                  >
                    <Text style={styles.headerTitle}>{section.title}</Text>
                    <MaterialIcons
                      name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={28}
                      color="#fff"
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Content */}
                {isExpanded && (
                  <View style={styles.content}>
                    <Component />
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: '#000',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  sectionWrapper: {
    marginBottom: 16,
    // Shadow blur effect (glowing)
    shadowColor: '#ff7acb',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  gradientBorder: {
    borderRadius: 12,
    padding: 2, // Độ dày viền gradient
  },
  section: {
    borderRadius: 10,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    backgroundColor: '#0a0a0a',
    padding: 16,
  },
});

export default AstrologyDetails;