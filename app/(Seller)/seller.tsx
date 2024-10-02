import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { SellerEdit, SellerGet } from "@/helpers/url";
import CenteredModal from "@/components/modal/modal-centered";
import { useFocusEffect } from "expo-router";

interface Terminal {
  id: string;
  name: string;
  account: string;
  filial_code: string;
  inn?: string;
  terminalSerialCode?: string;
  phones: string[];
}

interface TerminalNewUser {
  phone: string;
  password: string;
}

const Seller: React.FC = () => {
  const [terminalNewUsers, setTerminalNewUsers] = useState<TerminalNewUser[]>([
    { phone: "", password: "" },
  ]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    ism: "",
    hisob: "",
    filialKod: "",
    inn: "",
    terminalSeriyaKodu: "", // Not required for validation
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const {
    loading: loadingTerminals,
    error: errorTerminals,
    response: terminalList,
    globalDataFunc: fetchTerminalList,
  } = useGlobalRequest<{ object: Terminal[] }>(SellerGet, "GET");

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    globalDataFunc: updateTerminal,
  } = useGlobalRequest(true ? `${SellerEdit}` : "", "PUT", {
    phones: terminalNewUsers.map((user) => user.phone),
  });

  useFocusEffect(
    useCallback(() => {
      fetchTerminalList();
    }, [])
  );

  const handleAddPhoneNumber = () => {
    setTerminalNewUsers((prev) => [...prev, { phone: "", password: "" }]);
  };

  const handleRemovePhoneNumber = (index: number) => {
    setTerminalNewUsers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { ism, hisob, filialKod, inn } = formData;
    if (!ism || !hisob || !filialKod || !inn) {
      setErrorMessage("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle form submission here
      console.log("Form submitted:", { ...formData, terminalNewUsers });
      // Add your update terminal logic here
    }
  };

  const toggleModal = (terminal: Terminal) => {
    setFormData({
      ism: terminal.name || "",
      hisob: terminal.account || "",
      filialKod: terminal.filial_code || "",
      inn: terminal.inn || "",
      terminalSeriyaKodu: terminal.terminalSerialCode || "",
    });
    setModalVisible(true);
  };

  const resetFormData = () => {
    setFormData({
      ism: "",
      hisob: "",
      filialKod: "",
      inn: "",
      terminalSeriyaKodu: "",
    });
    setTerminalNewUsers([{ phone: "", password: "" }])
  };

  if (errorTerminals) return <Text>Error: {errorTerminals.message}</Text>;

  return (
    <View>
      <Text style={styles.title}>Terminals</Text>

      {loadingTerminals ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : terminalList?.object.length > 0 ? (
        terminalList.object.map((terminal: Terminal, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => toggleModal(terminal)} // Handle card press to open modal
          >
            <Text style={styles.cardTitle}>{terminal.account}</Text>
            <Text style={styles.cardText}>Name: {terminal.name}</Text>
            <Text style={styles.cardText}>Filial Code: {terminal.filial_code}</Text>
            <Text style={styles.cardText}>Phone: {terminal.phones[0]}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No Terminals Found</Text>
      )}

      <CenteredModal
        btnRedText="Close"
        btnWhiteText="Edit"
        isFullBtn
        isModal={isModalVisible}
        toggleModal={() => {
          setModalVisible(false);
          resetFormData(); // Reset form data when closing the modal
        }}
        onConfirm={handleSubmit}
      >
        <ScrollView>
          {[
            { key: "ism", label: "Ism" },
            { key: "hisob", label: "Hisob" },
            { key: "filialKod", label: "Filial kodi" },
            { key: "inn", label: "Inn raqami" },
            { key: "terminalSeriyaKodu", label: "Terminalning seriya kodi (ixtiyory)" }, // Optional
          ].map(({ key, label }) => (
            <TextInput
              key={key}
              placeholder={label}
              style={styles.input}
              value={formData[key as keyof typeof formData]}
              onChangeText={(text) => handleInputChange(key as keyof typeof formData, text)}
            />
          ))}

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <View style={styles.addPhoneSection}>
            <Text>Telefon raqam</Text>
            <TouchableOpacity onPress={handleAddPhoneNumber}>
              <AntDesign name="pluscircle" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {terminalNewUsers.map((user, index) => (
            <View key={index} style={styles.phoneRow}>
              <Text style={styles.phoneCode}>+998</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder={`Telefon raqam ${index + 1}`}
                keyboardType="numeric"
                value={user.phone}
                onChangeText={(text) => {
                  const updatedUsers = [...terminalNewUsers];
                  updatedUsers[index].phone = text;
                  setTerminalNewUsers(updatedUsers);
                }}
              />
              <Text>Password</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder={`Parol ${index + 1}`}
                secureTextEntry
                value={user.password}
                onChangeText={(text) => {
                  const updatedUsers = [...terminalNewUsers];
                  updatedUsers[index].password = text;
                  setTerminalNewUsers(updatedUsers);
                }}
              />
              {index > 0 && (
                <TouchableOpacity onPress={() => handleRemovePhoneNumber(index)}>
                  <AntDesign name="minuscircle" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </CenteredModal>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, marginBottom: 10 },
  card: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardText: { fontSize: 14, marginBottom: 5 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  errorText: { color: 'red', marginBottom: 10 },
  addPhoneSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  phoneRow: { alignItems: "center", marginBottom: 15 },
  phoneCode: { marginRight: 10 },
  phoneInput: { borderBottomWidth: 1, width: 100, padding: 8, marginRight: 5 },
  passwordInput: { borderBottomWidth: 1, width: 100, padding: 8, marginRight: 5 },
});

export default Seller;
