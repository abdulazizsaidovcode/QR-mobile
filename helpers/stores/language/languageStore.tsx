import { create } from "zustand";
import { ILanguage } from "@/types/language/language";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const langStore = create<ILanguage>((set) => ({
  selectedLang: "uz", // default value
  setSelectedLang: async (val: string) => {
    // Update state and store value in AsyncStorage
    await AsyncStorage.setItem("selectedLang", val);
    set({ selectedLang: val });
  },
  loadSelectedLang: async () => {
    // Load the selected language from AsyncStorage
    const storedLang = await AsyncStorage.getItem("selectedLang");
    if (storedLang) {
      set({ selectedLang: storedLang });
    }
  },
}));
