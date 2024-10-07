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
      AsyncStorage.setItem("token", updateProfile.response) 
    }
  }, [updateProfile.response])

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
    if (!formData.firstName.trim()) newErrors.firstName = "Ism kerak";
    if (!formData.lastName.trim()) newErrors.lastName = "Familiya kerak";
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon raqam kerak";
    } else if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Telefon raqam 9 raqamdan iborat bo'lishi kerak";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email kerak";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Email format noto'g'ri";
    }
    if (!formData.inn.trim()) newErrors.inn = "INN kerak";
    if (!formData.filial_code.trim())
      newErrors.filial_code = "Filial kod kerak";
    // Password is optional; no validation unless you want to enforce certain rules
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert("Xatolik", "Iltimos, barcha maydonlarni to'ldiring");
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

      Alert.alert("Muvaffaqiyatli", "Profil muvaffaqiyatli yangilandi");
      closeModal();
      getMee.globalDataFunc(); // Refresh profile data
    } catch (error) {
      Alert.alert("Xatolik", "Profilni yangilashda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.containerView}>
      <View style={styles.navigationContainer}>
        <NavigationMenu name="Profile" />
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
              <Text style={styles.editButtonText}>Profilni tahrirlash</Text>
            </View>
          </Pressable>
          {/* Profile Details */}
          <View style={styles.detailRow}>
            <Text style={styles.title}>Ism: </Text>
            <Text style={styles.desc}>
              {getMee?.response?.firstName || "--"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Familiya: </Text>
            <Text style={styles.desc}>
              {getMee?.response?.lastName || "--"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Telefon raqam: </Text>
            <Text style={styles.desc}>{getMee?.response?.phone || "--"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Email: </Text>
            <Text style={styles.desc}>{getMee?.response?.email || "--"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Inn: </Text>
            <Text style={styles.desc}>{getMee?.response?.inn || "--"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Filial kod: </Text>
            <Text style={styles.desc}>
              {getMee?.response?.filial_code || "--"}
            </Text>
          </View>
        </View>


        
        {/* Edit Profile Modal */}
        <CenteredModal
          btnRedText={submitting ? "..." : "Bekor qilish"}
          btnWhiteText={submitting ? "Yuklanmoqda..." : "Saqlash"}
          isFullBtn={true}
          isModal={modal}
          onConfirm={handleSubmit}
          toggleModal={closeModal}
          // disableWhiteButton={submitting}
        >
          <ScrollView style={{width: "100%"}}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profilni Tahrirlash</Text>
            <Text style={{fontSize: 15, paddingVertical: 3}}>Ism</Text>
            <TextInput
              style={styles.input}
              placeholder="Ism"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}

            <Text style={{fontSize: 15, paddingVertical: 3}}>Familiya</Text>
            <TextInput
              style={styles.input}
              placeholder="Familiya"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}

            <Text style={{fontSize: 15, paddingVertical: 3}}>Telefon raqam</Text>
            <View style={[styles.passwordContainer, {paddingRight: 0}]}>
              <View
               
                style={styles.eyeIcon}
              >
                <Text style={{fontSize: 17, paddingHorizontal: 5}}>+998</Text>
              </View>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Telefon raqam"
                keyboardType="numeric"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                maxLength={9}
              />
            </View>

            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            <Text style={{fontSize: 15, paddingVertical: 3}}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text style={{fontSize: 15, paddingVertical: 3}}>Inn</Text>
            <TextInput
              style={styles.input}
              placeholder="Inn"
              value={formData.inn}
              onChangeText={(text) => handleInputChange("inn", text)}
            />
            {errors.inn && <Text style={styles.errorText}>{errors.inn}</Text>}

            <Text style={{fontSize: 15, paddingVertical: 3}}>Filial kod</Text>
            <TextInput
              style={styles.input}
              placeholder="Filial kod"
              value={formData.filial_code}
              onChangeText={(text) => handleInputChange("filial_code", text)}
            />
            {errors.filial_code && (
              <Text style={styles.errorText}>{errors.filial_code}</Text>
            )}

            <Text style={{fontSize: 15, paddingVertical: 3}}>Parol (Agar parol kiritilmasa eski parol saqlanadi)</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Parol (ixtiyoriy)"
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
    paddingBottom: 20,
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
