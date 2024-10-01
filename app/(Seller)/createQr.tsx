import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const CreateQr = () => {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleSendMoney = () => {
        console.log(`Sending $${amount} with message: "${message}"`);
    };

    return (
        <View style={styles.container}>
            {/* <View style={styles.header}>
                <Text style={styles.headerText}>Send to George</Text>
                <TouchableOpacity>
                    <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
            </View> */}
            <ScrollView
                contentContainerStyle={{}
                }>
                <Text style={styles.label}>Enter Amount</Text>
                <TextInput
                    style={styles.amountInput}
                    value={`$${amount}`}
                    onChangeText={text => setAmount(text.replace(/[^0-9]/g, ''))} // Allow only numbers
                    keyboardType="numeric"
                />
            </ScrollView>
            {/* <Text style={styles.label}>Message (Optional)</Text>
            <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                maxLength={50}
                multiline
            /> */}
            <Text style={styles.note}>Make sure the nominal you write is correct</Text>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMoney}>
                <Text style={styles.sendButtonText}>Save Money</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    changeText: {
        color: '#007bff',
    },
    label: {
        marginTop: 20,
        fontSize: 16,
    },
    amountInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 40,
        marginTop: 8,
        height: 70,
    },
    messageInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        height: 80,
        textAlignVertical: 'top',
    },
    sendButton: {
        backgroundColor: Colors.dark.primary,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 60
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    note: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 10,
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
    },
    key: {
        width: '30%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        margin: '1.5%',
    },
    keyText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CreateQr;
