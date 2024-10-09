import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  Dimensions,
  StatusBar,
  BackHandler,
  ActivityIndicator,
  Pressable,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import TransactionCard from "@/components/cards/tranzaktionCards";
import TransactionActionCard from "@/components/cards/tranzaktionActionCards";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { FlatList } from "react-native";
import TransactionActionHeadCard from "@/components/cards/tranzaktionActionCardsHead";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { useCallback, useEffect, useState } from "react";
import {
  payment_get_seller,
  payment_get_terminal,
  staisticUrl,
} from "@/helpers/url";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [url, setUrl] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(0);
  const [backPressCount, setBackPressCount] = useState(0);
  const { response, globalDataFunc, loading } = useGlobalRequest(
    staisticUrl,
    "GET",
    "DEFAULT"
  );
  const transactionGet = useGlobalRequest(
    `${url}?page=${page}`,
    "GET",
    "DEFAULT"
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (backPressCount === 0) {
          setBackPressCount(backPressCount + 1);
          // Toast.show('Orqaga qaytish uchun yana bir marta bosing', Toast.SHORT);
          setTimeout(() => {
            setBackPressCount(0);
          }, 2000); // 2 soniya ichida ikkinchi marta bosilmasa, holatni qayta boshlaydi
          return true; // Orqaga qaytishni bloklaydi
        } else {
          BackHandler.exitApp(); // Ilovadan chiqish
          return false;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [backPressCount])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole ? storedRole : "");
        if (storedRole === "ROLE_SELLER") {
          setUrl(payment_get_seller);
        } else if (storedRole === "ROLE_TERMINAL") {
          setUrl(payment_get_terminal);
        }
      };
      fetchRole();
      globalDataFunc();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (url) {
        transactionGet.globalDataFunc();
      }
    }, [url])
  );

  useFocusEffect(
    useCallback(() => {
      transactionGet.globalDataFunc()
    }, [page])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#f5f5f5" }}
      headerImage={
        <Image
          style={{ width: "100%", objectFit: "contain" }}
          source={require("./../../assets/images/main.jpg")}
        />
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={{ marginBottom: 40 }}>
        {role === "ROLE_SELLER" && (
          <View style={{ flexDirection: "row", gap: 5 }}>
            <TransactionActionCard
              title="Terminals"
              desc={
                response && response.terminalCount && response.terminalCount
              }
              icon={
                <FontAwesome5
                  name="calculator"
                  size={26}
                  color={Colors.light.primary}
                />
              } // Pass the icon as a prop
              onPress={() => console.log("Send Money Pressed")}
            />
            <TransactionActionCard
              title="Cancelled transactions"
              desc={
                response &&
                response.transactionCountCancel &&
                response.paymentTotalBalance
              }
              icon={
                <MaterialIcons
                  name="money-off"
                  size={36}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => console.log("Receive Money Pressed")}
            />
          </View>
        )}
        {role === "ROLE_SELLER" && (
          <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
            <TransactionActionCard
              title="Number of terminal users"
              desc={response && response.userCount && response.userCount}
              icon={
                <FontAwesome5
                  name="users"
                  size={26}
                  color={Colors.light.primary}
                />
              } // Pass the icon as a prop
              onPress={() => console.log("Send Money Pressed")}
            />
            <TransactionActionCard
              title="Transactions"
              desc={
                response &&
                response.transactionCountWaitOrCompleted &&
                response.transactionCountWaitOrCompleted
              }
              icon={
                <FontAwesome6
                  name="money-bill-transfer"
                  size={26}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => console.log("Receive Money Pressed")}
            />
            <TransactionActionHeadCard
              title="Total payment"
              desc={
                response &&
                response.paymentTotalBalance ?
                response.paymentTotalBalance : 0
              }
              icon={
                <FontAwesome5
                  name="money-bill"
                  size={36}
                  color={Colors.light.primary}
                />
              } // Another icon
              onPress={() => console.log("Receive Money Pressed")}
            />
          </View>
        )}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Payments({transactionGet?.response?.totalElements})
          </Text>
          <Text style={styles.headerText}>
            Current({page + 1})
          </Text>
        </View>

        {transactionGet?.response?.object.length > 0 ?
        <FlatList

          data={transactionGet?.response?.object}
          // keyExtractor={(item) => item.id} // Use a unique key for each item
          renderItem={({ item }) => <TransactionCard transaction={item} />}
        />
        :  <Text style={styles.noDataText}>No user terminals found.</Text>
        }
        {
          transactionGet?.response?.object.length > 0 && 

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
              Last
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (page + 1 < transactionGet?.response?.totalPage)
                setPage(page + 1);
            }}
            disabled={page === transactionGet?.response?.totalPage}
          >
            <Text
              style={[
                styles.paginationButton,
                page === transactionGet?.response?.totalPage &&
                  styles.disabledButton,
              ]}
            >
              Next
            </Text>
          </Pressable>
        </View>
        }
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: Platform.OS === "android" ? 35 : 0,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    color: Colors.dark.primary,
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    color: Colors.dark.primary,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
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
    backgroundColor: "#d3d3d3", // Disabled rang
    color: "#888", // Disabled matn rangi
  },
});
