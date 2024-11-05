import Buttons from "@/components/buttons/button";
import { langStore } from "@/helpers/stores/language/languageStore";
import { SocketStore } from "@/helpers/stores/socket/socketStore";
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Modal from "react-native-modal";

const { height, width } = Dimensions.get("window");

const CallBackModal: React.FC = () => {
  const {
    setSocketData,
    setSocketLoading,
    setSocketModal,
    setSocketModalData,
    setTimer,
    socketData,
    socketLoading,
    socketModal,
    socketModalData,
    timer,
  } = SocketStore();
  const { langData } = langStore();
  return (
    <View style={{ flex: 1 }}>
      <Modal
        isVisible={socketModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="black"
        coverScreen={true}
        deviceHeight={height}
        deviceWidth={width}
        hasBackdrop={true}
        hideModalContentWhileAnimating={true}
        // onBackdropPress={onClose}
        // onBackButtonPress={onClose}
        useNativeDriver={true}
      >
        <View style={styles.modalView}>
          <View style={{ width: "100%", gap: 10 }}>
            <Text style={styles.title}>
              {langData?.MOBILE_COMPANY_NAME || "Название компании"}:
            </Text>
            <Text style={styles.desc}>
              {socketModalData?.merchant || "-"}
            </Text>
          </View>
          <View style={[styles.buttonContainer, styles.flexRow]}>
            <Buttons
              backgroundColor={"#FF5A3A"}
              title={"Tugma 1"} // Tugma nomini qo'shing
              textColor={"white"}
              onPress={() => {}}
            />
            <View style={[styles.marginHorizontal]}>
              <Buttons
                backgroundColor={"#e8e8e8"}
                title={"Tugma 2"} // Tugma nomini qo'shing
                textColor={"#FF5A3A"}
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.modalView}>
          <View style={{ width: "100%", gap: 10 }}>
            <Text style={styles.title}>
              {langData?.MOBILE_COMPANY_NAME || "Название компании"}:
            </Text>
            <Text style={styles.desc}>
              {socketModalData?.merchant || "-"}
            </Text>
          </View>
          <View style={[styles.buttonContainer, styles.flexRow]}>
            <Buttons
              backgroundColor={"#FF5A3A"}
              title={"Tugma 1"} // Tugma nomini qo'shing
              textColor={"white"}
              onPress={() => {}}
            />
            <View style={[styles.marginHorizontal]}>
              <Buttons
                backgroundColor={"#e8e8e8"}
                title={"Tugma 2"} // Tugma nomini qo'shing
                textColor={"#FF5A3A"}
                onPress={() => {}}
              />
            </View>
          </View>
        </View>

        <View style={styles.modalView}>
          <View style={{ width: "100%", gap: 10 }}>
            <Text style={styles.title}>
              {langData?.MOBILE_COMPANY_NAME || "Название компании"}:
            </Text>
            <Text style={styles.desc}>
              {socketModalData?.client || "-"}
            </Text>
          </View>

          <View style={[styles.buttonContainer, styles.flexRow]}>
            <Buttons
              backgroundColor={"#FF5A3A"}
              title={"Tugma 1"} // Tugma nomini qo'shing
              textColor={"white"}
              onPress={() => {}}
            />
            <View style={[styles.marginHorizontal]}>
              <Buttons
                backgroundColor={"#e8e8e8"}
                title={"Tugma 2"} // Tugma nomini qo'shing
                textColor={"#FF5A3A"}
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    // Modal uchun uslublar
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    // Sarlavha uslublari
    fontSize: 18,
    fontWeight: "bold",
  },
  desc: {
    // Tavsif uslublari
    fontSize: 16,
  },
  buttonContainer: {
    // Tugmalar konteyneri uslublari
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexRow: {
    // Flex uslublari
    flexDirection: "row",
  },
  marginHorizontal: {
    // Gorizontal margin
    marginHorizontal: 10,
  },
});

export default CallBackModal;
