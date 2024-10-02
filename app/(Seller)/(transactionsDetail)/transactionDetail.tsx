import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
// import NavigationMenu from "../../../components/navigation copy/NavigationMenu";

const TransactionDeatail = () => {
  return (
    <View style={{flex: 1, }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        {/* <NavigationMenu name="Payment detail" /> */}
        <View style={styles.detailCard}>
            <View style={styles.detailCard}>
              <Text style={styles.title}>Partner: </Text>
              <Text style={styles.desc}> WELLTECH</Text>
            </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TransactionDeatail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
    paddingVertical: Platform.OS === "android" ? 35 : 0,
  },
  containerIN: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  detailCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginBottom: 12,
      borderRadius: 8,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      elevation: 3
  },
  title: {
    fontSize: 22,
    color: "#000",
  },
  desc: {

  }
});
