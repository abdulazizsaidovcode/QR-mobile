import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalRequest } from '@/helpers/apifunctions/univesalFunc';
import { seller_notification, terminal_notification, isRead_notification } from '@/helpers/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const Notifications = () => {
  const [url, setUrl] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      setRole(storedRole);
      if (storedRole === 'ROLE_SELLER') {
        setUrl(seller_notification);
      } else if (storedRole === 'ROLE_TERMINAL') {
        setUrl(terminal_notification);
      }
    };
    fetchRole();
  }, []);

  const { response, globalDataFunc } = useGlobalRequest(url, 'GET');
  const { globalDataFunc: postFunc } = useGlobalRequest(isRead_notification, 'POST');

  useEffect(() => {
    if (url) {
      globalDataFunc();
    }
  }, [url]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().split(' ')[0].slice(0, 5);
    return `${formattedDate} T ${formattedTime}`;
  };

  const sortedNotifications = response?.object?.sort(
    (a: { isRead: string }, b: { isRead: string }) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1)
  );

  const markAllAsRead = () => {
    const unreadNotifications = response?.object?.filter((item) => !item.isRead);
    const notificationIds = unreadNotifications.map((item) => item.id);

    postFunc({
      ids: notificationIds, // Assuming the API accepts an array of notification IDs
      isRead: true,
    }).then(() => {
      globalDataFunc(); // Refresh notifications after marking them as read
    });
  };

  const deleteAllNotifications = () => {
    // Add logic to delete notifications via API
    setModalVisible(false); // Close the modal
    globalDataFunc(); // Refresh the data after deletion
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Notifications for {role === 'ROLE_SELLER' ? 'Sellers' : 'Terminals'}
      </Text>
      <View style={styles.CarsContainer}>
        {sortedNotifications && sortedNotifications.length > 0 ? (
          sortedNotifications.map((item: { id: number; title: string; createdAt: string; isRead: string }) => (
            <View key={item.id} style={item.isRead ? styles.cards : styles.cards21}>
              {item.isRead ? (
                <MaterialIcons name="done-all" size={24} color="#ccc" />
              ) : (
                <MaterialIcons name="done" size={24} color="#828282" />
              )}
              <View>
                <Text style={item.isRead ? styles.greycolor : styles.Darkcolor}>
                  {item.title}
                </Text>
              </View>
              <Text style={item.isRead ? { color: '#ccc', fontSize: 10 } : styles.date}>{formatDate(item.createdAt)}</Text>
            </View>
          ))
        ) : (
          <Text>No notifications available</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={markAllAsRead}>
          <Text style={styles.buttonText}>Mark All as Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Delete All</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to delete all notifications?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={deleteAllNotifications}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius: 5,
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cards21: {
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius: 5,
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  greycolor: {
    color: '#ccc',
  },
  Darkcolor: {
    color: '#000',
  },
  date: {
    fontSize: 10,
    color: '#666',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center', // Center modal content vertically
    alignItems: 'center', // Center modal content horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background for modal overlay
  },
  modalContent: {
    width: '80%', // Set a width for the modal content
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#007bff', // Consistent theme color
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
});
