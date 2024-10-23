import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { FontAwesome } from "@expo/vector-icons"; // For password visibility icon
import CenteredModal from "@/components/modal/modal-centered";
import NavigationMenu from "@/components/navigationMenu/NavigationMenu";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { get_mee, update_profile } from "@/helpers/url"; // Ensure you have an update_profile URL
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangeLang from "./changeLang";

// Define the shape of the profile data
interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  inn: string;
  filial_code: string;
  password: string;
}

// Define the shape of errors
interface ProfileErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  inn?: string;
  filial_code?: string;
  password?: string;
}

const Profile: React.FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const getMee = useGlobalRequest<ProfileData>(get_mee, "GET");
  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    inn: "",
    filial_code: "",
    password: "",
  });
  const updateProfile = useGlobalRequest<any>(update_profile, "PUT", {
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: `+998${formData.phone}`,
    email: formData.email,
    inn: formData.inn,
    filial_code: formData.filial_code,
    ...(formData.password ? { password: formData.password } : {}),
  }); // Adjust the type as per your API response

  const [errors, setErrors] = useState<ProfileErrors>({});
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Open the modal and initialize form data
  const openModal = () => {
    setFormData({
      firstName: getMee?.response?.firstName || "",
      lastName: getMee?.response?.lastName || "",
      phone: getMee?.response?.phone?.substring(4) || "",
      email: getMee?.response?.email || "",
      inn: getMee?.response?.inn || "",
      filial_code: getMee?.response?.filial_code || "",
      password: "",
    });
    setErrors({});
    setModal(true);
  };

  const closeModal = () => setModal(false);

  // Fetch profile data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      getMee.globalDataFunc();
    }, [])
  );

  useEffect(() => {
    if (updateProfile.response) {
      AsyncStorage.setItem("token", updateProfile.response);
    }
  }, [updateProfile.response]);

  // Handle input changes
  const handleInputChange = (name: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate the form
  const validate = (): boolean => {
    const newErrors: ProfileErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Нужно имя";
    if (!formData.lastName.trim()) newErrors.lastName = "Требуется фамилия";
    if (!formData.phone.trim()) {
      newErrors.phone = "Требуется номер телефона";
    } else if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Номер телефона должен состоять из 9 цифр.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Требуется электронная почта";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Формат электронной почты noto'g'ri";
    }
    if (!formData.inn.trim()) newErrors.inn = "ИНН обязателен";
    if (!formData.filial_code.trim())
      newErrors.filial_code = "Требуется партнерский код";
    // Password is optional; no validation unless you want to enforce certain rules
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }

    setSubmitting(true);

    try {
      await updateProfile.globalDataFunc();

      console.log({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        inn: formData.inn,
        filial_code: formData.filial_code,
        ...(formData.password ? { password: formData.password } : {}),
      });

      Alert.alert("Успех", "Профиль успешно обновлен.");
      closeModal();
      getMee.globalDataFunc(); // Refresh profile data
    } catch (error) {
      Alert.alert("Ошибка, «Произошла ошибка при обновлении профиля.»");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.containerView}>
      <View style={styles.navigationContainer}>
        <NavigationMenu name="Профиль" />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.detailCard}>
          <View style={styles.avatarContainer}>
            <Avatar
              rounded
              size="xlarge"
              overlayContainerStyle={{ backgroundColor: "lightgray" }}
              icon={{ name: "user", type: "font-awesome", color: "white" }}
            />
          </View>
          <Pressable onPress={openModal}>
            <View style={styles.editButton}>
              <Text style={styles.editButtonText}>Редактировать профиль</Text>
            </View>
          </Pressable>
          {/* Profile Details */}
          <View style={styles.detailRow}>
            <Text style={styles.title}>Имя: </Text>
            <Text style={styles.desc}>
              {getMee?.response?.firstName || "--"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Фамилия: </Text>
            <Text style={styles.desc}>
              {getMee?.response?.lastName || "--"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Номер телефона: </Text>
            <Text style={styles.desc}>{getMee?.response?.phone || "--"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Электронная почта: </Text>
            <Text style={styles.desc}>{getMee?.response?.email || "--"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>ИНН: </Text>
            <Text style={styles.desc}>{getMee?.response?.inn || "--"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Партнерский код: </Text>
            <Text style={styles.desc}>
              {getMee?.response?.filial_code || "--"}
            </Text>
          </View>
        </View>
        {/* <ChangeLang /> */}

        {/* Edit Profile Modal */}
        <CenteredModal
          btnRedText={submitting ? "..." : "Отмена"}
          btnWhiteText={submitting ? "Загрузка..." : "Сохранять"}
          isFullBtn={true}
          isModal={modal}
          onConfirm={handleSubmit}
          toggleModal={closeModal}
          // disableWhiteButton={submitting}
        >
          <ScrollView style={{ width: "100%" }}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Редактировать профиль</Text>
              <Text style={{ fontSize: 15, paddingVertical: 3 }}>Имя</Text>
              <TextInput
                style={styles.input}
                placeholder="Имя"
                value={formData.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}

              <Text style={{ fontSize: 15, paddingVertical: 3 }}>Фамилия</Text>
              <TextInput
                style={styles.input}
                placeholder="Фамилия"
                value={formData.lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}

              <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                Номер телефона
              </Text>
              <View style={[styles.passwordContainer, { paddingRight: 0 }]}>
                <View style={styles.eyeIcon}>
                  <Text style={{ fontSize: 17, paddingHorizontal: 5 }}>
                    +998
                  </Text>
                </View>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Номер телефона"
                  keyboardType="numeric"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                  maxLength={9}
                />
              </View>

              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              <Text style={{ fontSize: 15, paddingVertical: 3 }}>Электронная почта</Text>
              <TextInput
                style={styles.input}
                placeholder="Электронная почта"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <Text style={{ fontSize: 15, paddingVertical: 3 }}>ИНН</Text>
              <TextInput
                style={styles.input}
                placeholder="ИНН"
                value={formData.inn}
                keyboardType="numeric"
                maxLength={14}    
                onChangeText={(text) => handleInputChange("inn", text)}
              />
              {errors.inn && <Text style={styles.errorText}>{errors.inn}</Text>}

              <Text style={{ fontSize: 15, paddingVertical: 3 }}>
                Партнерский код
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Партнерский код"
                value={formData.filial_code}
                onChangeText={(text) => handleInputChange("filial_code", text)}
              />
              {errors.filial_code && (
                <Text style={styles.errorText}>{errors.filial_code}</Text>
              )}

              <Text style={{ fontSize: 15, paddingVertical: 3 }}>
              Пароль (если пароль не введен, старый пароль будет сохранен)
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Пароль (необязательно)"
                  secureTextEntry={!passwordVisible}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                />
                <Pressable
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.eyeIcon}
                >
                  <FontAwesome
                    name={passwordVisible ? "eye" : "eye-slash"}
                    size={24}
                    color="gray"
                  />
                </Pressable>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
          </ScrollView>
        </CenteredModal>
      </ScrollView>
      {/* Loading Indicator */}
      {updateProfile.loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default Profile;

// Styles
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  navigationContainer: {
    paddingTop: 35,
  },
  scrollView: {
    paddingVertical: 20,
  },
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
  avatarContainer: {
    justifyContent: "center",
    paddingVertical: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    color: "red",
    fontSize: 17,
    fontWeight: "600",
  },
  detailRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: "#000",
    fontWeight: "700",
  },
  desc: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark.primary,
  },
  modalContent: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    // flex: 1,
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingRight: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    bottom: -5,
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
