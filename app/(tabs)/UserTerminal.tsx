import Navbar from "@/components/navbar/navbar";
import { Colors } from "@/constants/Colors";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import { UserTerminalGet } from "@/helpers/url";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";

interface UserTerminal {
  id: number;
  name: string;
  address: string;
  phone: string;
  lastName: string;
  firstName: string;
  email: string;
  terminalName: string | null;
  inn: string | null;
  filialCode: string | null;
}

interface UserTerminalResponse {
  object: UserTerminal[];
}

export default function UserTerminal() {
    const [page, setPage] = useState(0);
  const { response, loading, error, globalDataFunc } = useGlobalRequest<
    UserTerminalResponse
  >(`${UserTerminalGet}?page=${page}`, "GET");


  useFocusEffect(
      useCallback(() => {
        globalDataFunc();
      }, [])
  )

  useFocusEffect(
    useCallback(() => {
        globalDataFunc();
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
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          marginBottom: 10,
          paddingBottom: 40,
        }}
      >
        <View>
        <View style={styles.header}>
            <Text style={styles.headerText}>
              Terminal users({response?.totalElements ? response?.totalElements : 0})
            </Text>
            <Text style={styles.headerText}>Current({page + 1})</Text>
          </View>
          {response && response?.object?.length > 0 ? (
            response?.object?.map((item: any) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Name:</Text>
                  <Text style={styles.cardDetail}>{item.name || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Phone:</Text>
                  <Text style={styles.cardDetail}>{item.phone || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Terminal:</Text>
                  <Text style={styles.cardDetail}>
                    {item.terminalName || "-"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Last Name:</Text>
                  <Text style={styles.cardDetail}>{item.lastName || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>First Name:</Text>
                  <Text style={styles.cardDetail}>{item.firstName || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Email:</Text>
                  <Text style={styles.cardDetail}>{item.email || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>INN:</Text>
                  <Text style={styles.cardDetail}>{item.inn || "-"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.boldText}>Filial Code:</Text>
                  <Text style={styles.cardDetail}>
                    {item.filialCode || "-"}
                  </Text>
                </View>
                <View style={styles.separator} />
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No user terminals found.</Text>
          )}
        </View>
        {response && response?.object?.length > 0 &&
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
                if (page + 1 < response?.totalPage) setPage(page + 1);
              }}
              disabled={page + 1 === response?.totalPage}
            >
              <Text
                style={[
                  styles.paginationButton,
                  page + 1 === response?.totalPage && styles.disabledButton,
                ]}
              >
                Next
              </Text>
            </Pressable>
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: Platform.OS === "android" ? 35 : 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 30,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  cardDetail: {
    fontSize: 16,
    color: "#666",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
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
