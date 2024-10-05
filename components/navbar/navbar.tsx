import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Avatar } from "react-native-elements";
import Feather from "@expo/vector-icons/Feather";
import { RootStackParamList } from "@/types/root/root";
import { NavigationProp } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import {
  get_mee,
  seller_notification_count,
  terminal_notification_count,
} from "@/helpers/url";
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
  );

  const getCount = useGlobalRequest(url, "GET");
  const getMee = useGlobalRequest(get_mee, "GET");

  useFocusEffect(
    useCallback(() => {
      if (url) {
        getCount.globalDataFunc();
      }
    }, [url])
  );
  useFocusEffect(
    useCallback(() => {
        getMee.globalDataFunc();
    }, [])
  );

  

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate("(Seller)/(profile)/profile")}>

      <View style={styles.greetingContainer}>
        <Avatar
          rounded
          size="medium"
          overlayContainerStyle={{ backgroundColor: "lightgray" }}
          icon={{ name: "user", type: "font-awesome", color: "white" }}
        />

        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>Hi, {getMee?.response?.firstName ? getMee?.response?.firstName : "-- --"} {getMee?.response?.lastName}</Text>
          <Text style={styles.subText}>{getMee?.response?.phone ? getMee?.response?.phone : "-- --- -- --"}</Text>
        </View>
      </View>
      </Pressable>
      <View style={{ flexDirection: "row", gap: 8, paddingRight: 10 }}>
        <View style={{ position: "relative" }}>
          {getCount.response > 0 && (
            <View
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                backgroundColor: "red",
                borderRadius: 50,
                right: 2,
              }}
            ></View>
          )}
          <Text>
            <Feather
              onPress={() => {
                0;
                navigation.navigate("(Seller)/notifications/notifications");
              }}
              name="bell"
              size={24}
              color="black"
            />
          </Text>
        </View>
        <Feather
          onPress={async () => {
            await AsyncStorage.removeItem("token")
            await AsyncStorage.removeItem("role")
            await navigation.navigate("(auth)/login");
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
