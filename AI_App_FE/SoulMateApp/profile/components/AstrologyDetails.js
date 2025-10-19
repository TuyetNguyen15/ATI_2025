// src/components/AstrologyDetails.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
          <View key={section.id} style={styles.section}>
            <TouchableOpacity
              style={styles.header}
              onPress={() => toggleSection(section.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.headerTitle}>{section.title}</Text>
              <MaterialIcons
                name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={28}
                color="#fff"
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.content}>
                <Component />
              </View>
            )}
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
  section: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#478ae8',
    borderRadius: 12,
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#478ae8',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    backgroundColor: '#000',
  },
});

export default AstrologyDetails;