import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { createPayment } from "@/helpers/url";
import ErrorBoundary from "@/components/ErrorBoundary";
import { RenderQRCode } from "@/components/QRgenerate";

const CreateQr = () => {
  const [amount, setAmount] = useState("");
  const [Messageamount, setMessageAmount] = useState("");
  const [alertShown, setAlertShown] = useState(false);
  const [qrValue, setQrValue] = useState(""); // State to hold the QR code value

  const paymentCreate = useGlobalRequest(
    createPayment,
    "POST",
    { amount: amount },
    "DEFAULT"
  );

  useEffect(() => {
    if (paymentCreate.response && !alertShown) {
      // alert(paymentCreate.response);
      setMessageAmount(amount);
      setQrValue(`${paymentCreate.response}`); // Set the QR code value to the response
      setAlertShown(true);
    } else if (paymentCreate.error && !alertShown) {
      setMessageAmount("0");
      alert(paymentCreate.error);
      setAlertShown(true);
    }
  }, [paymentCreate.response, paymentCreate.error]);

  // Reset alertShown when the amount changes
  useEffect(() => {
    setAlertShown(false);
  }, [amount]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{}}>
        <Text style={styles.label}>Enter Amount</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))} // Allow only numbers
          keyboardType="numeric"
        />
        {qrValue ? ( // Render QR code if qrValue is set
          <View style={styles.qrContainer}>
            <View style={{ paddingVertical: 10 }}>
              <Text style={styles.qrTextTop}>
                {`QR amount: ${Messageamount} UZS`}
              </Text>
            </View>
            <ErrorBoundary>
            <RenderQRCode url={qrValue}/> 
            </ErrorBoundary>
            <Text style={styles.qrText}>Scan this QR code to proceed</Text>
          </View>
        ) : null}
      </ScrollView>
      <Text style={styles.note}>
        Make sure the nominal you write is correct
      </Text>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => paymentCreate.globalDataFunc()}
      >
        <Text style={styles.sendButtonText}>
          {paymentCreate.loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            "Save Money"
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 20,
    fontSize: 16,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 40,
    marginTop: 8,
    height: 70,
  },
  sendButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 60,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  note: {
    textAlign: "center",
    color: "gray",
    marginTop: 10,
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
    fontSize: 26,
    textAlign: "center",
  },
});

export default CreateQr;
