import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import Feather from '@expo/vector-icons/Feather'

const Navbar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        <Avatar
          rounded
          size="medium"
          overlayContainerStyle={{ backgroundColor: 'lightgray' }}
          icon={{ name: 'user', type: 'font-awesome', color: 'white' }}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>Hi, John!</Text>
          <Text style={styles.subText}>Good Morning</Text>
        </View>
      </View>
      <Feather name="bell" size={24} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Navbar;
