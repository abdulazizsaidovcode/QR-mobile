import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import Feather from "@expo/vector-icons/Feather";
import { RootStackParamList } from "@/types/root/root";
import { NavigationProp } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { seller_notification_count, terminal_notification_count } from "@/helpers/url";
type SettingsScreenNavigationProp = NavigationProp<
  RootStackParamList,
  "(tabs)"
>;

const Navbar = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [url, setUrl] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        if (storedRole === "ROLE_SELLER") {
          setUrl(seller_notification_count);
        } else if (storedRole === "ROLE_TERMINAL") {
          setUrl(terminal_notification_count);
        }
      };
      fetchRole();
    }, [])
  )

  const getCount = useGlobalRequest(url, "GET");

  useFocusEffect(
    useCallback(() => {
      if (url) {
        getCount.globalDataFunc();
      }
    }, [url])
  )

  

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Avatar
          rounded
          size="medium"
          overlayContainerStyle={{ backgroundColor: "lightgray" }}
          icon={{ name: "user", type: "font-awesome", color: "white" }}
        />

        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>Hi, John!</Text>
          <Text style={styles.subText}>Good Morning</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 8, paddingRight: 10 }}>
        <View style={{position: "relative"}}>
          {getCount.response && getCount.response > 0 && <View style={{position: "absolute", width: 10, height: 10, backgroundColor: "red", borderRadius: 50, right: 3}}></View>}
          <Feather
            onPress={() => {
              navigation.navigate("(Seller)/notifications/notifications");
            }}
            name="bell"
            size={24}
            color="black"
          />
        </View>
        <Feather
          onPress={() => {
            navigation.navigate("(auth)/login");
            AsyncStorage.clear();
          }}
          name="log-out"
          size={24}
          color="black"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "gray",
  },
});

export default Navbar;
