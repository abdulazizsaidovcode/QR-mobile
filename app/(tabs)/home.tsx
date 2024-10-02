import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  Dimensions,
  StatusBar,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import TransactionCard from "@/components/cards/tranzaktionCards";
import TransactionActionCard from "@/components/cards/tranzaktionActionCards";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { FlatList } from "react-native";
import TransactionActionHeadCard from "@/components/cards/tranzaktionActionCardsHead";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { useEffect } from "react";
import { payment_get_seller, staisticUrl } from "@/helpers/url";
import Seller from "../(Seller)/seller";
import UserTerminal from "./UserTerminal";

export default function HomeScreen() {
  const { response, globalDataFunc } = useGlobalRequest(
    staisticUrl,
    "GET",
    "DEFAULT"
  );
  const transactionGet = useGlobalRequest(payment_get_seller, "GET", "DEFAULT");

  console.log(transactionGet.response?.object[1]);
  useEffect(() => {
    globalDataFunc();
    transactionGet.globalDataFunc();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#f5f5f5" }}
      headerImage={
        <Image source={require("./../../assets/images/Wallet Card.png")} />
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={{ marginBottom: 40 }}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <TransactionActionCard
            title="Terminals"
            desc={response && response.terminalCount && response.terminalCount}
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
            title=""
            desc={
              response &&
              response.paymentTotalBalance &&
              response.paymentTotalBalance
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
        <View style={styles.header}>
          <Text style={styles.headerText}>Latest Transactions</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          data={transactionGet?.response?.object}
          // keyExtractor={(item) => item.id} // Use a unique key for each item
          renderItem={({ item }) => <TransactionCard transaction={item} />}
        />
      </View>
      <Seller />
      <UserTerminal />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
});
