import CenteredModal from "@/components/modal/modal-centered";
import Navbar from "@/components/navbar/navbar";
import { Colors } from "@/constants/Colors";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import {
  post_terminal,
  UserTerminaldelete,
  UserTerminalGet,
  UserTerminalListGet,
} from "@/helpers/url";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Install this package if not already
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // For password visibility toggle

interface UserTerminal {
  id: number;
  name: string;
  address: string;
  phone: string;
  lastName: string;
  firstName: string;
  email: string;
  terminalName: string | null;
  inn: string | null;
  filialCode: string | null;
}

interface UserTerminalResponse {
  object: UserTerminal[];
  totalElements: number;
  totalPage: number;
}

export default function UserTerminal() {
  const [page, setPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(
    false
  );
  const [TerminalId, setTerminalId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    terminalId: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { response, loading, error, globalDataFunc } = useGlobalRequest<
    UserTerminalResponse
  >(`${UserTerminalGet}?page=${page}`, "GET");

  const terminalList = useGlobalRequest<UserTerminalResponse>(
    `${UserTerminalListGet}?page=${page}`,
    "GET"
  );

  const terminalDelete = useGlobalRequest<UserTerminalResponse>(
    `${UserTerminaldelete}?userId=${TerminalId}`,
    "DELETE"
  );

  const editTerminal = useGlobalRequest(`${post_terminal}`, "POST", {
    terminalId: formData.terminalId,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: `+998${formData.phone}`,
    password: formData.password,
  });

  useFocusEffect(
    useCallback(() => {
      globalDataFunc();
    }, [page])
  );

  useFocusEffect(
    useCallback(() => {
      globalDataFunc();
      terminalList.globalDataFunc();
    }, [])
  );

  
    useEffect(() => {
      if (editTerminal?.response) {
        alert("Пользователь терминала добавлен успешно!");
        globalDataFunc();
        terminalList.globalDataFunc();
      } else if (editTerminal?.error) {
        alert("Ошибка добавления пользователя терминала.");
      }
    }, [editTerminal?.response, editTerminal?.error])

    useEffect(() => {
      if (terminalDelete?.response) {
        alert("Пользователь терминала успешно удален");
        globalDataFunc();
        terminalList.globalDataFunc();
      } else if (terminalDelete?.error) {
        alert("Произошла ошибка при удалении пользователя терминала.");
      }
    }, [terminalDelete?.response, terminalDelete?.error])

  const validateForm = () => {
    const { terminalId, firstName, lastName, phone, password } = formData;
    if (!terminalId || !firstName || !lastName || !phone || !password) {
      setErrorMessage("Пожалуйста, заполните все обязательные поля.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const resetFormData = () => {
    setFormData({
      terminalId: "",
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
    });
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      editTerminal.globalDataFunc();

      setModalVisible(false); // Close modal after submission
      // Optionally reset form
      resetFormData();
    }
  };

  const handleInputChange = (
    name: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          marginBottom: 10,
          paddingBottom: 40,
        }}
      >
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>
            Пользователи терминала (
              {response?.totalElements ? response?.totalElements : 0})
            </Text>
            <Text style={styles.headerText}>Текущий ({page + 1})</Text>
          </View>
          <Pressable
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={[styles.paginationButton]}>
            Создать пользователя
            </Text>
          </Pressable>
          {response && response.object.length > 0 ? (
            response.object.map((item: UserTerminal) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Терминал Имя:</Text>
                  <Text style={styles.cardDetail}>{item.name || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Телефон:</Text>
                  <Text style={styles.cardDetail}>{item.phone || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Терминал:</Text>
                  <Text style={styles.cardDetail}>
                    {item.terminalName || "-"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Фамилия:</Text>
                  <Text style={styles.cardDetail}>{item.lastName || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Имя:</Text>
                  <Text style={styles.cardDetail}>{item.firstName || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Электронная почта:</Text>
                  <Text style={styles.cardDetail}>{item.email || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>ИНН:</Text>
                  <Text style={styles.cardDetail}>{item.inn || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Партнерский код:</Text>
                  <Text style={styles.cardDetail}>
                    {item.filialCode || "-"}
                  </Text>
                </View>
                <View style={styles.separator} />
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setTerminalId(item.id);
                      setDeleteModalVisible(true);
                    }}
                  >
                    <MaterialIcons
                      style={{ color: "red" }}
                      name="delete-forever"
                      size={30}
                      color="black"
                    />
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Пользовательские терминалы не найдены.</Text>
          )}
        </View>
        {response && response.object.length > 0 && (
          <View style={styles.paginationContainer}>
            <Pressable
              onPress={() => {
                if (page > 0) setPage(page - 1);
              }}
              disabled={page === 0}
            >
              <Text
                style={[
                  styles.paginationButton,
                  page === 0 && styles.disabledButton,
                ]}
              >
                Последний
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (page + 1 < response.totalPage) setPage(page + 1);
              }}
              disabled={page + 1 === response.totalPage}
            >
              <Text
                style={[
                  styles.paginationButton,
                  page + 1 === response.totalPage && styles.disabledButton,
                ]}
              >
                Следующий
              </Text>
            </Pressable>
          </View>
        )}
        <CenteredModal
          btnRedText="Закрывать"
          btnWhiteText={editTerminal?.loading ? <ActivityIndicator size="small" color={Colors.light.primary} /> : "Сохранять"}
          isFullBtn
          isModal={isModalVisible}
          toggleModal={() => {
            setModalVisible(false);
            resetFormData();
          }}
          onConfirm={handleSubmit}
        >
          <ScrollView style={{ width: "100%" }}>
            <Text style={styles.modalTitle}>Добавить пользователя</Text>

            {/* Terminal Selection */}
            <Text style={styles.label}>Терминал</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.terminalId}
                onValueChange={(itemValue: any) =>
                  handleInputChange("terminalId", itemValue)
                }
                style={styles.picker}
              >
                <Picker.Item label="Выберите терминал" value={0} />
                {terminalList?.response?.map((terminal: UserTerminal) => (
                  <Picker.Item
                    key={terminal.id}
                    label={terminal.name}
                    value={terminal.id}
                  />
                ))}
              </Picker>
            </View>

            {/* First Name */}
            <Text style={styles.label}>Имя</Text>
            <TextInput
              placeholder="Имя"
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
            />

            {/* Last Name */}
            <Text style={styles.label}>Фамилия</Text>
            <TextInput
              placeholder="Фамилия"
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
            />

            {/* Phone Number */}
            <Text style={styles.label}>Телефон</Text>
            <View style={styles.phoneContainer}>
              <Text style={styles.phonePrefix}>+998</Text>
              <TextInput
                placeholder="YY XXX XX XX"
                style={styles.phoneInput}
                keyboardType="number-pad"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Пароль</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Пароль"
                style={styles.passwordInput}
                secureTextEntry={!passwordVisible}
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </ScrollView>
        </CenteredModal>
        <CenteredModal
          btnRedText="Нет"
          btnWhiteText="Да"
          isFullBtn
          isModal={isDeleteModalVisible}
          toggleModal={() => {
            setDeleteModalVisible(false);
          }}
          onConfirm={() => {
            terminalDelete.globalDataFunc()
            setDeleteModalVisible(false)
          }}
        >
          <ScrollView style={{ width: "100%" }}>
            <Text style={styles.modalTitle}>Вы уверены, что хотите удалить этого пользователя?</Text>
          </ScrollView>
        </CenteredModal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: Platform.OS === "android" ? 35 : 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
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
  modalTitle: {
    fontSize: 20,
    paddingVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  cardDetail: {
    fontSize: 16,
    color: "#666",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  paginationButton: {
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.primary,
    color: "white",
    borderRadius: 5,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#d3d3d3", // Disabled color
    color: "#888", // Disabled text color
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderRadius: 10,
    marginVertical: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  phonePrefix: {
    fontSize: 17,
    color: "#000",
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 17,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 17,
    color: "#000",
  },
});
