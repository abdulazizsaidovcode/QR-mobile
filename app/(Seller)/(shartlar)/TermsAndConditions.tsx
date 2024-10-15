// src/components/TermsAndConditions.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';

const TermsAndConditions: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Shartlar (T&C)</Text>
      <Text style={styles.updated}>Oxirgi yangilangan: 14/10/2024</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Umumiy ma'lumot</Text>
        <Text style={styles.sectionContent}>
          Ushbu hujjat SBP QRPay ilovasidan foydalanishni boshqaradi. Bizning ilovamizdan foydalanish orqali foydalanuvchilar quyidagi shartlar va shartlarga rozilik bildiradilar.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Foydalanish bo'yicha ko'rsatmalar</Text>
        <Text style={styles.sectionContent}>
          Sotuvchilar QR kodlarini faqat o'z xizmatlari yoki mahsulotlari bilan bog'liq qonuniy tranzaktsiyalar uchun yaratish uchun javobgardir. Uzrli sabablarsiz QR kodlarini yaratish qat'iyan man etiladi.
          {'\n\n'}
          Foydalanuvchilar barcha toʻlov tranzaksiyalari toʻgʻri bajarilishini taʼminlashi kerak va har qanday xatoliklar darhol xabar qilinishi kerak.
        </Text>
      </View>

      {/* Qo'shimcha bandlarni shu tarzda qo'shing */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Amaldagi qonun</Text>
        <Text style={styles.sectionContent}>
          Ushbu Shartlar va shartlar O'zbekistan qonunlari bilan tartibga solinadi, uning qonun hujjatlari ziddiyatidan qat'i nazar.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  updated: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default TermsAndConditions;
