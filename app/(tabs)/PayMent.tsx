import { Keyboard, SafeAreaView, StatusBar, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Navbar from '@/components/navbar/navbar';
import CreateQr from '../(Seller)/createQr';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { SocketStore } from '@/helpers/stores/socket/socketStore';

export default function PaymentQr() {
  const { setSocketData, setSocketLoading, setSocketModal, setSocketModalData, setTimer, socketData, socketLoading, socketModal, socketModalData, timer } = SocketStore()

  const socket = io("http://185.74.4.138:9092");

  useEffect(() => {
    const reconnectSocket = () => {
      if (!socketData || (socketData && !(socketData as any)?.connected)) {
        setSocketData(socket);
        // console.log("Socket qayta ulashdi");
        // console.clear();
      }
    };

    reconnectSocket();

    return () => {
      // socket.disconnect(); // Bu yerda socketni uzish jarayoni o'chirildi
    };
  }, [socketData]);

  useEffect(() => {
    socketData?.on('connect', function() {
      // console.log("Connected to Socket.IO server ID: " + socketData?.id);
      // consoleClear();
    });

    socketData?.on('callback-web-or-app', function(data: any) {
      // console.log("data", data);
      setSocketModalData(data);
      // consoleClear();
    });

    return () => {
      socketData?.off('connect');
      socketData?.off('callback-web-or-app');
    };
  }, [socketData]);

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
