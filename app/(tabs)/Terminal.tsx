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
import { Colors } from "@/constants/Colors";

interface Terminal {
  id: number;
  name: string | null;
  account: string | null;
  filial_code: string | null;
  inn?: string | null;
  terminalSerialCode?: string;
  phones: string[];
}

interface TerminalNewUser {
  phone: string;
  password: string;
}

const Terminal: React.FC = () => {
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
  const [TerminalId, setTerminalId] = useState<number | null>(null);

  const isEmptyNewUsers = terminalNewUsers.every(
    (user: any) => !user.phone && !user.password
  );

  const {
    loading: loadingTerminals,
    error: errorTerminals,
    response: terminalList,
    globalDataFunc: fetchTerminalList,
  } = useGlobalRequest<{ object: Terminal[] }>(SellerGet, "GET");

  const editTerminal = useGlobalRequest(
    `${SellerEdit}${TerminalId ? TerminalId : 0}`,
    "PUT",
    {
      account: formData.hisob,
      filialCode: formData.filialKod,
      inn: formData.inn,
      name: formData.ism,
      terminalSerialCode: formData.terminalSeriyaKodu,
      terminalNewUsers: isEmptyNewUsers ? null : terminalNewUsers,
    }
  );

  useFocusEffect(
    useCallback(() => {
      fetchTerminalList();
    }, [])
  );

  useEffect(() => {
    if (editTerminal?.response) {
      alert("Terminal muvafaqqiyatli tahrirlandi!");
    } else if (editTerminal?.error) {
      alert(editTerminal?.error);
    }
  }, [editTerminal.response, editTerminal.error]);

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
      // console.log("Form submitted:", { ...formData, terminalNewUsers });
      console.log("Form submitted:", {
        account: formData.hisob,
        filialCode: formData.filialKod,
        inn: formData.inn,
        name: formData.ism,
        terminalSerialCode: formData.terminalSeriyaKodu,
        terminalNewUsers: isEmptyNewUsers ? null : terminalNewUsers.map((item) => ({
          phone: `+998${item.phone}`,
          password: item.password
      })),
      });
      editTerminal.globalDataFunc();
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
    setTerminalNewUsers([{ phone: "", password: "" }]);
  };

  if (errorTerminals) return <Text>Error: {errorTerminals.message}</Text>;

  return (
    <View>
      <Text style={styles.title}>Terminals</Text>

      {loadingTerminals ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : terminalList?.object?.length > 0 ? (
        terminalList?.object?.map((terminal: Terminal, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              setTerminalId(terminal?.id);
              toggleModal(terminal);
            }} // Handle card press to open modal
          >
            <Text style={styles.cardTitle}>{terminal.account || "-"}</Text>
            <Text style={styles.cardText}>Name: {terminal.name || "-"}</Text>
            <Text style={styles.cardText}>
              Account: {terminal.account || "-"}
            </Text>
            <Text style={styles.cardText}>
              Filial Code: {terminal.filial_code || "-"}
            </Text>
            <Text style={styles.cardText}>
              Phone: {terminal.phones[0] || "-"}
            </Text>
            <Text style={styles.cardText}>Inn: {terminal.inn || "-"}</Text>
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
            {
              key: "terminalSeriyaKodu",
              label: "Terminalning seriya kodi (ixtiyory)",
            }, // Optional
          ].map(({ key, label }) => (
            <TextInput
              key={key}
              placeholder={label}
              style={styles.input}
              value={formData[key as keyof typeof formData]}
              onChangeText={(text) =>
                handleInputChange(key as keyof typeof formData, text)
              }
            />
          ))}

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <View style={styles.addPhoneSection}>
            <Text>Telefon raqam</Text>
            <TouchableOpacity onPress={handleAddPhoneNumber}>
              <AntDesign name="pluscircle" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {terminalNewUsers?.map((user, index) => (
            <View key={index} style={styles.phoneRow}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <View style={styles.phoneCard}>
                  {/* <Image source={require('../../../../assets/images/uzb.png')} /> */}
                  <Text style={{ fontSize: 17, color: "gray" }}>+998</Text>
                </View>
                <View style={{ width: "69%" }}>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder={`Telefon raqam ${index + 1}`}
                    value={user.phone}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const updatedUsers = [...terminalNewUsers];
                      updatedUsers[index].phone = text;
                      setTerminalNewUsers(updatedUsers);
                    }}
                    maxLength={12}
                    placeholderTextColor={"gray"}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <View style={{ width: "85%" }}>
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
                </View>
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => handleRemovePhoneNumber(index)}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 5,
                        marginTop: 15,
                      }}
                    >
                      {/* <Image source={require('../../../../assets/images/uzb.png')} /> */}
                      <AntDesign name="minuscircle" size={24} color="black" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginVertical: 10,
    color: "#000",
    fontSize: 17,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  errorText: { color: "red", marginBottom: 10 },
  addPhoneSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  phoneRow: { alignItems: "center", marginBottom: 15 },
  phoneCode: { marginRight: 10 },
  phoneInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    color: "#000",
    fontSize: 17,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  passwordInput: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    color: "#000",
    fontSize: 17,
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  phoneCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "29%",
    shadowColor: Colors.dark.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});

export default Terminal;
