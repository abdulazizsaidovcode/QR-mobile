import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import CreateQr from '../(Seller)/createQr';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SocketStore } from '@/helpers/stores/socket/socketStore';

const socket = io("https://socket.qrpay.uz", {
  secure: true,
  transports: ['websocket', 'polling'] // WebSocket va Pollingni qo'llash
});
export default function PaymentQr() {
  const { setSocketData, setSocketModalData, socketData, } = SocketStore()

  useEffect(() => {
    const reconnectSocket = () => {
      if (!socket.connected) {
        // console.log("Socket qayta ulashga harakat qilinmoqda...");
        socket.connect();
      }
    };

    socket.on('connect_error', () => {
      setTimeout(reconnectSocket, 5000); // 5 soniyadan so'ng qayta urinish
    });

    // Socket hodisalarini ulash
    socket.on('connect', function () {
      // console.log("Connected to Socket.IO server ID: " + socket.id);
      setSocketData(socket)
    });

    socket.on('callback-web-or-app', function (data) {
      // console.log("data", data);
      setSocketModalData(data);
    });

    return () => {
      // socket.off('connect'); // Socket hodisasini o'chirish
      // socket.off('callback-web-or-app'); // Socket hodisasini o'chirish
      // socket.disconnect(); // Socketni uzish
    };
  }, [socketData]);

  socketData?.on('connect', function () {
    // console.log("Connected to Socket.IO server ID: " + socketData?.id);
    setSocketData(socket)
  });

  socketData?.on('callback-web-or-app', function (data: any) {
    // console.log("data", data);
    setSocketModalData(data)
  });
  console.log(socketData);
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <Navbar /> */}
      <CreateQr />
      {/* </SafeAreaView> */}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: Platform.OS === 'android' ? 35 : 0,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  }
});
