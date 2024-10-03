import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import OrderStore from "@/helpers/stores/order/orderStore";
import { TouchableOpacity } from "react-native-gesture-handler";
import CenteredModal from "@/components/modal/modal-centered";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { cancel_payment } from "@/helpers/url";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/root/root";
// import NavigationMenu from "../../../components/navigation copy/NavigationMenu";
type SettingsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "(Seller)/(transactionsDetail)/transactionDetail"
>;

const TransactionDeatail = () => {
  const { paymentDetail } = OrderStore();
  const [modal, isModal] = useState(false);
  const paymentCancel = useGlobalRequest(
    `${cancel_payment}?ext_id=${paymentDetail?.transaction?.ext_id}`,
    "POST",
    {},
    "DEFAULT"
  );
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const openModal = () => isModal(true);
  const closeModal = () => isModal(false);

  useEffect(() => {
    if (paymentCancel.response) {
      // alert(paymentCreate.response);
      navigation.goBack();
    } else if (paymentCancel.error) {
      alert(paymentCancel.error);
    }
  }, [paymentCancel.error, paymentCancel.response]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        {/* <NavigationMenu name="Payment detail" /> */}
        <View style={styles.detailCard}>
          {/* <View style={styles.detailCardIn}>
              <Text style={styles.title}>Ext ID: </Text>
              <Text style={styles.desc}>{paymentDetail.transaction.ext_id}</Text>
            </View> */}
          <View style={styles.detailCardIn}>
            <Text style={{ fontSize: 22 }}>To'lov uchun chek</Text>
            {/* <Text style={styles.desc}>{paymentDetail.transaction.partner ? paymentDetail?.transaction?.partner : "-"}</Text> */}
          </View>
          <View style={styles.detailCardIn}>
            <Text style={styles.title}>Partner: </Text>
            <Text style={styles.desc}>
              {paymentDetail.transaction.partner
                ? paymentDetail?.transaction?.partner
                : "-"}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              justifyContent: "space-between",
              paddingVertical: 7,
              gap: 5,
            }}
          >
            <Text style={styles.title}>Purpose: </Text>
            <Text style={styles.desc}>
              {paymentDetail.transaction.purpose
                ? paymentDetail?.transaction?.purpose
                : "-"}
            </Text>
          </View>
          {/* <View style={styles.detailCardIn}>
              <Text style={styles.title}>QR ID: </Text>
              <Text style={styles.desc}>{paymentDetail.transaction.qrc_id}</Text>
            </View> */}
          {/* <View style={styles.detailCardIn}>
              <Text style={styles.title}>QR miqdori: </Text>
              <Text style={styles.desc}>{paymentDetail.transaction.qrAmount}</Text>
            </View> */}
          <View style={styles.detailCardIn}>
            <Text style={styles.title}>Status: </Text>
            <Text style={styles.desc}>
              {paymentDetail.transaction.status
                ? paymentDetail?.transaction?.status
                : "-"}
            </Text>
          </View>
          <View style={styles.detailCardIn}>
            <Text style={styles.title}>Check Miqdori: </Text>
            <Text style={styles.desc}>
              {paymentDetail.transaction.qrAmount
                ? `${paymentDetail.transaction.qrAmount} RUB`
                : "-"}
            </Text>
          </View>
          <View style={styles.detailCardIn}>
            <Text style={styles.title}>Check Miqdori: </Text>
            <Text style={styles.desc}>
              {paymentDetail.transaction.chequeAmount
                ? `${paymentDetail.transaction.chequeAmount} UZS`
                : "-"}
            </Text>
          </View>
          {/* <View style={styles.detailCardIn}>
              <Text style={styles.title}>Local QR: </Text>
              <Text style={styles.desc}>{paymentDetail.transaction.local_qrc_id}</Text>
            </View> */}
          {/* <View style={styles.detailCardIn}>
              <Text style={styles.title}>Daraja: </Text>
              <Text style={styles.desc}>{paymentDetail.transaction.rate}</Text>
            </View> */}
          <View style={styles.detailCardIn}>
            <Text style={styles.title}>Sana: </Text>
            <Text style={styles.desc}>
              {paymentDetail?.transaction?.cheque_created_at
                ? paymentDetail.transaction.cheque_created_at.substring(0, 16)
                : "-"}
            </Text>
          </View>

          <View style={styles.qrContainer}>
            <View style={{ paddingVertical: 10 }}>
              <Text
                style={styles.qrTextTop}
              >{`QR amount: ${paymentDetail.transaction.qrAmount} RUB`}</Text>
            </View>
            <QRCode
              value={paymentDetail.transaction.url} // The value to encode in the QR code
              size={250} // Size of the QR code
              color="black" // Color of the QR code
              backgroundColor="white" // Background color of the QR code
            />
            <Text style={styles.qrText}>Scan this QR code to proceed</Text>
          </View>
          <Pressable onPress={() => openModal()}>
            <View style={styles.detailCardIn}>
              <Text style={{ color: "red", fontSize: 17 }}>
                To'lovni bekor qilish
              </Text>
            </View>
          </Pressable>
        </View>
      <CenteredModal
        btnRedText="Close"
        btnWhiteText="Ok"
        isFullBtn={true}
        isModal={modal}
        onConfirm={() => {
          paymentCancel.globalDataFunc()
          closeModal()
        }}
        toggleModal={() => closeModal()}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
            backgroundColor: "#f8f9fa",
            padding: 15,
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 18, color: "#000", textAlign: "center" }}>
            Haqiqiatdan ham siz bu to'lovni bekor qilasizmi?
          </Text>
        </View>
      </CenteredModal>
      </View>
    </View>
  );
};

export default TransactionDeatail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
    paddingVertical: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  detailCardIn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
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
  title: {
    fontSize: 20,
    color: "#000",
    fontWeight: "700",
  },
  desc: {
    fontSize: 15,
    fontWeight: "600",
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
  },
});
