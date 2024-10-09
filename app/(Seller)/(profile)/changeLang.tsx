import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from "react-native-paper";
import { Avatar } from "react-native-elements";

const ChangeLang = () => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  useEffect(() => {
    // Fetch default language from AsyncStorage
    const fetchLang = async () => {
      const savedLang = await AsyncStorage.getItem("selectedLang");
      if (savedLang) {
        setSelectedLang(savedLang);
      }
    };
    fetchLang();
  }, []);

  const handleLangChange = async (lang: string) => {
    setSelectedLang(lang);
    await AsyncStorage.setItem("selectedLang", lang);
  };

  return (
    <View style={styles.detailCard}>
      <View style={styles.detailRow}>
        <RadioButton
          value="uz"
          status={selectedLang === "uz" ? "checked" : "unchecked"}
          onPress={() => handleLangChange("uz")}
        />
        <Avatar
          rounded
          size="medium"
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/6211/6211657.png",
          }} // Replace with actual flag image path
        />
        <Text style={styles.title}>Uz </Text>
      </View>
      <View style={styles.detailRow}>
        <RadioButton
          value="ru"
          status={selectedLang === "ru" ? "checked" : "unchecked"}
          onPress={() => handleLangChange("ru")}
        />
        <Avatar
          rounded
          size="medium"
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/6211/6211549.png",
          }} // Replace with actual flag image path
        />
        <Text style={styles.title}>RU </Text>
      </View>
    </View>
  );
};

export default ChangeLang;

const styles = StyleSheet.create({
  detailCard: {
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  detailRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
        paddingVertical: 7,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: "#000",
    fontWeight: "700",
  },
});
