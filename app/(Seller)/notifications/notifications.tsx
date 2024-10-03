import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useGlobalRequest } from "@/helpers/apifunctions/univesalFunc";
import {
  seller_notification,
  terminal_notification,
  isRead_notification,
  delete_notification,
} from "@/helpers/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import CenteredModal from "@/components/modal/modal-centered";
import { useFocusEffect } from "expo-router";

const Notifications = () => {
  const [url, setUrl] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {}, []);
  const [selectedIds, setSelectedIds] = useState([]);

  const { response, globalDataFunc, loading } = useGlobalRequest(url, "GET");
  const isReadNotification = useGlobalRequest(
    isRead_notification,
    "POST",
    selectedIds.length > 0 ? { ids: selectedIds } : { ids: [] }
  );
  const deleteNotification = useGlobalRequest(
    delete_notification,
    "POST",
    selectedIds.length > 0 ? { ids: selectedIds } : { ids: [] }
  );

  useFocusEffect(
    useCallback(() => {
      const fetchRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole);
        if (storedRole === "ROLE_SELLER") {
          setUrl(seller_notification);
        } else if (storedRole === "ROLE_TERMINAL") {
          setUrl(terminal_notification);
        }
      };
      fetchRole();
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
      if (url) {
        globalDataFunc();
      }
    }, [url])
  )
  
  useEffect(() => {
    if (isReadNotification.response) {
      globalDataFunc()
    }
  }, [isReadNotification.response])

  useEffect(() => {
   if (deleteNotification.response) {
      globalDataFunc()
      alert("Bildirishnomalar tozalandi.")
      
      setModalVisible(false)
    }
  }, [ deleteNotification.response])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5);
    return `${formattedDate} T ${formattedTime}`;
  };

  const sortedNotifications = response?.object?.sort(
    (a: { isRead: string }, b: { isRead: string }) =>
      a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1
  );

  const handleSelectIsReadIds = async () => {
    if (response?.object) {
      // isRead false bo'lgan elementlarning id larini olish
      const ids = response?.object
        ? response?.object
            .filter((item: any) => !item.isRead) // isRead false bo'lganlarni filtrlash
            .map((item: any) => item.id)
        : []; // ularning id larini olish

      if (ids && ids.length > 0) {
        await setSelectedIds(ids);
        await isReadNotification.globalDataFunc();
      } else {
        alert("Sizda bildirishnoma yo'q.");
      }
    }
  };

  const handleSelectAllIds = async () => {

    if (response?.object) {
      const ids = await response?.object.map((item: any) => item.id);

      if (ids && ids.length > 0) {
        await setSelectedIds(ids);
        await deleteNotification.globalDataFunc();
      } else {
        alert("Sizda bildirishnoma yo'q.");
      }
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Notifications for {role === "ROLE_SELLER" ? "Sellers" : "Terminals"}
      </Text>
      <View style={styles.CarsContainer}>
        {
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) :
        sortedNotifications && sortedNotifications.length > 0 ? (
          sortedNotifications.map(
            (item: {
              id: number;
              title: string;
              createdAt: string;
              isRead: string;
            }) => (
              <View
                key={item.id}
                style={item.isRead ? styles.cards : styles.cards21}
              >
                {item.isRead ? (
                  <MaterialIcons name="done-all" size={24} color="#ccc" />
                ) : (
                  <MaterialIcons name="done" size={24} color="#828282" />
                )}
                <View>
                  <Text
                    style={item.isRead ? styles.greycolor : styles.Darkcolor}
                  >
                    {item.title}
                  </Text>
                </View>
                <Text
                  style={
                    item.isRead ? { color: "#ccc", fontSize: 10 } : styles.date
                  }
                >
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            )
          )
        ) : (
          <Text>No notifications available</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSelectIsReadIds()}
        >
          {
            isReadNotification.loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) :
          <Text style={styles.buttonText}>Mark all as read</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          {
            deleteNotification.loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) :
            <Text style={styles.buttonText}>Delete All</Text>
          }
          
        </TouchableOpacity>
      </View>

      <CenteredModal
        btnRedText="No"
        btnWhiteText="Yes"
        isFullBtn={true}
        isModal={modalVisible}
        toggleModal={() => setModalVisible(!modalVisible)}
        onConfirm={() => handleSelectAllIds()}
      >
        <View>
          <Text style={{ fontSize: 20 }}>
            Are you sure you want to delete all notifications?
          </Text>
        </View>
      </CenteredModal>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 25,
    marginVertical: 30,
  },
  CarsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  cards: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderRadius: 5,
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cards21: {
    borderWidth: 1,
    borderBlockColor: "#FF5A3A",
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderRadius: 5,
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  greycolor: {
    color: "#ccc",
  },
  Darkcolor: {
    color: "#000",
  },
  date: {
    fontSize: 10,
    color: "#666",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  button: {
    backgroundColor: "#FF5A3A",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
