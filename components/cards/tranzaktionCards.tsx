// TransactionCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TransactionCardProps {
    transaction: {
        title: string;
        date: string;
        amount: number;
    };
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
    if (!transaction) return null; // If no transaction data, return null

    return (
        <View style={styles.card}>
            <Icon name="attach-money" size={24} color={transaction.amount < 0 ? 'red' : 'green'} />
            <View style={styles.textContainer}>
                <View>
                    <Text style={styles.title}>{transaction.title}</Text>
                    <Text style={styles.date}>{transaction.date}</Text>
                </View>
                <Text style={{ color: transaction.amount <= 0 ? "red" : 'green' }}>
                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    textContainer: {
        marginLeft: 10, // Space between icon and text
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        paddingRight: 10
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 12,
        color: 'gray',
    },
});

export default TransactionCard;
