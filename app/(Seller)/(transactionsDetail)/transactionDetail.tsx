// TransactionDetail.tsx
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import OrderStore from "@/helpers/stores/order/orderStore";
import { TouchableOpacity } from "react-native-gesture-handler";
import CenteredModal from "@/components/modal/modal-centered";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { cancel_payment } from "@/helpers/url";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root/root";
import NavigationMenu from "@/components/navigationMenu/NavigationMenu"; // Adjusted path
import { Ionicons } from '@expo/vector-icons'; // For optional improvements
import ErrorBoundary from '@/components/ErrorBoundary'; // Import the ErrorBoundary component
import { RenderQRCode } from "@/components/QRgenerate";

type TransactionDetailNavigationProp = NavigationProp<
  RootStackParamList,
  "(Seller)/(transactionsDetail)/transactionDetail"
>;

const TransactionDetail = () => {
  const { paymentDetail } = OrderStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation<TransactionDetailNavigationProp>();

  // Initialize useGlobalRequest without executing immediately
  const paymentCancel = useGlobalRequest(
    `${cancel_payment}?ext_id=${paymentDetail?.transaction?.ext_id}`,
    "POST",
    {}
  );

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    if (paymentCancel?.response) {
      Alert.alert("Успех", "Платеж отменен.");
      navigation.goBack();
    } else if (paymentCancel.error) {
      Alert.alert("Ошибка", paymentCancel.error);
    }
  }, [paymentCancel.error, paymentCancel.response]);

  // Ensure paymentDetail and transaction are defined
  if (!paymentDetail || !paymentDetail?.transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noDataText}>Платежные реквизиты отсутствуют.</Text>
      </SafeAreaView>
    );
  }

  const handleCancelPayment = () => {
    // Optionally, add confirmation before cancelling
    paymentCancel.globalDataFunc(); // Trigger the cancellation request
    closeModal();
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.navigationContainer}>
        <NavigationMenu name="Проверка оплаты" />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView style={styles.container}>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.title}> Партнер:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.partner || "-"}
            </Text>
          </View>
          <View style={{width: "100%", gap: 10}}>
            <Text style={styles.title}>Цель:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.purpose || "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Статус:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.status || "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Сумма чека (руб.):</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.qrAmount
                ? `${paymentDetail?.transaction?.qrAmount} RUB`
                : "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Сумма чека (сум):</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.chequeAmount
                ? `${paymentDetail?.transaction?.chequeAmount} UZS`
                : "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.title}>Дата:</Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.cheque_created_at
                ? paymentDetail?.transaction?.cheque_created_at.substring(0, 16)
                : "-"}
            </Text>
          </View>

          <View style={styles.qrContainer}>
            <View style={{ paddingVertical: 10 }}>
              <Text style={styles.qrTextTop}>
                {`QR-сумма: ${paymentDetail?.transaction?.qrAmount} RUB`}
              </Text>
            </View>
            {/* Wrap QRCode with ErrorBoundary */}
            <ErrorBoundary>
              <RenderQRCode url={paymentDetail?.transaction?.url}/> 
            </ErrorBoundary>
            <Text style={styles.qrText}>Чтобы продолжить, отсканируйте этот QR-код.</Text>
          </View>

          <Pressable onPress={openModal}>
            <View style={styles.cancelPayment}>
              <Text style={styles.cancelPaymentText}>
              Отмена платежа
              </Text>
            </View>
          </Pressable>
        </View>

        <CenteredModal
          btnRedText="Close"
          btnWhiteText="Ok"
          isFullBtn={true}
          isModal={isModalVisible}
          onConfirm={handleCancelPayment}
          toggleModal={closeModal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
            Вы действительно собираетесь отменить этот платеж?
            </Text>
          </View>
        </CenteredModal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionDetail;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  navigationContainer: {
    paddingTop: Platform.OS === "android" ? 35 : 0,
    padding: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
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
    color: "#333",
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 30,
  },
  qrText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  qrTextTop: {
    marginTop: 10,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelPayment: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
  },
  cancelPaymentText: {
    color: "red",
    fontSize: 17,
    fontWeight: "600",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f8f9fa",
    padding: 15,
    gap: 10,
  },
  modalText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },
});
