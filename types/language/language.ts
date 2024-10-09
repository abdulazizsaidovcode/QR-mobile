export interface ILanguage {
    selectedLang: string;
    setSelectedLang: (val: string) => Promise<void>; // Async function for setting language
    loadSelectedLang: () => Promise<void>; // Async function for loading language
  }
  