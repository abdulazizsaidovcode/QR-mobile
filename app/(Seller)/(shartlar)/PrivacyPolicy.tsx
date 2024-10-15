// src/components/PrivacyPolicy.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';

const PrivacyPolicy: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Maxfiylik siyosati</Text>
      <Text style={styles.updated}>Oxirgi yangilangan: 14.10.2024</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Umumiy ko‘rinish</Text>
        <Text style={styles.sectionContent}>
          SBP QRPay da biz sizning maxfiyligingizni himoya qilishga sodiqmiz. Ushbu Maxfiylik siyosati sizning ma'lumotlaringizni qanday yig'ishimiz, ishlatishimiz va saqlashimizni tushuntiradi.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Biz to'playdigan ma'lumotlar</Text>
        <Text style={styles.sectionContent}>
          Biz quyidagi turdagi ma'lumotlarni yig'amiz:
        </Text>
        <View style={styles.subSection}>
          <Text style={styles.bulletPoint}>• Kompaniya tafsilotlari: Kompaniya nomlari, soliq identifikatsiya raqamlari (INN) va sotuvchi bilan bog'lanish ma'lumotlari kabi ma'lumotlar.</Text>
          <Text style={styles.bulletPoint}>• Tranzaksiya ma'lumotlari: to'lov summalari, to'lov usullari va to'lov summalariga oid statistik ma'lumotlar.</Text>
          <Text style={styles.bulletPoint}>• Ilovadan foydalanish maʼlumotlari: Foydalanuvchilarning ilova bilan qanday aloqada boʻlishlari, jumladan login va QR yaratish faoliyati haqida maʼlumot.</Text>
        </View>
      </View>

      {/* Qo'shimcha bandlarni shu tarzda qo'shing */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Maxfiylik siyosatiga yangilanishlar</Text>
        <Text style={styles.sectionContent}>
          Bu siyosat vaqti-vaqti bilan yangilanishi mumkin. Biz foydalanuvchilarni har qanday muhim o'zgarishlar haqida xabardor qilamiz va yangilanishlardan keyin xizmatdan foydalanishni davom ettirish sizning qayta ko'rib chiqilgan siyosatni qabul qilganingizni anglatadi.
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
  subSection: {
    marginLeft: 10,
    marginTop: 10,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default PrivacyPolicy;
