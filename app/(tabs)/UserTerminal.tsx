import { useGlobalRequest } from '@/helpers/apifunctions/univesalFunc';
import { UserTerminalGet } from '@/helpers/url';
import React, { useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';

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
    const { response, loading, error, globalDataFunc } = useGlobalRequest<UserTerminalResponse>(
        UserTerminalGet,
        'GET'
    );

    useEffect(() => {
        // Call the fetch function when the component mounts
        globalDataFunc();
    }, [globalDataFunc]);

    // Handle loading state
    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Handle error state
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error fetching user terminals: {error.message}</Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={styles.title}>
                User Terminals ({response.object.length})
            </Text>
            {response && response.object.length > 0 ? (
                response.object.map((item: {
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
                }) => (
                    <View key={item.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardDetail}>Phone: {item.phone || '-'}</Text>
                        <Text style={styles.cardDetail}>Terminal: {item.terminalName || '-'}</Text>
                        <Text style={styles.cardDetail}>Last Name: {item.lastName || '-'}</Text>
                        <Text style={styles.cardDetail}>First Name: {item.firstName || '-'}</Text>
                        <Text style={styles.cardDetail}>Email: {item.email || '-'}</Text>
                        <Text style={styles.cardDetail}>INN: {item.inn || '-'}</Text>
                        <Text style={styles.cardDetail}>Filial Code: {item.filialCode || '-'}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.noDataText}>No user terminals found.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
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
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardDetail: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
