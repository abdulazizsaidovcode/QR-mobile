// TransactionActionCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface TransactionActionCardProps {
    title: string;
    icon: React.ReactNode;
    desc: any
    onPress: () => void;
}
const { width, height } = Dimensions.get('window')


const TransactionActionCard = ({ title, desc, icon, onPress }: TransactionActionCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {icon}
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.desc}>{desc}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '49%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingVertical: 22,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        color: 'gray',
        marginLeft: 10, // Space between icon and text
    },
    desc: {
        fontSize: 16,
        marginLeft: 10, // Space between icon and text
    },
});

export default TransactionActionCard;
