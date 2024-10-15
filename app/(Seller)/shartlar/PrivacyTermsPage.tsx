// src/screens/PrivacyTermsPage.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PrivacyPolicy from '../(shartlar)/PrivacyPolicy';
import TermsAndConditions from '../(shartlar)/TermsAndConditions';


const PrivacyTermsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('terms');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Siyosatlar</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'terms' && styles.activeTab]} 
          onPress={() => setActiveTab('terms')}
        >
          <Text style={[styles.tabText, activeTab === 'terms' && styles.activeTabText]}>Shartlar (T&C)</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'privacy' && styles.activeTab]} 
          onPress={() => setActiveTab('privacy')}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>Maxfiylik siyosati</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {activeTab === 'terms' ? <TermsAndConditions /> : <PrivacyPolicy />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 20,
  },
  tabContainer: {
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderColor: '#ccc',
  },
  tab: {
    flex: 1, 
    paddingVertical: 15, 
    backgroundColor: '#f9f9f9',
  },
  activeTab: {
    borderBottomWidth: 3, 
    borderColor: '#008080',
    backgroundColor: '#fff',
  },
  tabText: {
    textAlign: 'center', 
    fontSize: 16, 
    color: '#555',
  },
  activeTabText: {
    color: '#008080', 
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1, 
    padding: 10,
  },
});

export default PrivacyTermsPage;
