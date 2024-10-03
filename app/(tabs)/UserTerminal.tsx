import Navbar from '@/components/navbar/navbar';
import { useGlobalRequest } from '@/helpers/apifunctions/univesalFunc';
import { UserTerminalGet } from '@/helpers/url';
import React, { useEffect } from 'react';
import { Text, View, ActivityIndicator, StyleSheet, SafeAreaView, Platform, ScrollView } from 'react-native';

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
        globalDataFunc();
    }, [globalDataFunc]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error fetching user terminals: {error.message}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Navbar />
            <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 10 }}
            >
                <View>
                    <Text style={styles.title}>
                        User Terminals ({response && response?.object?.length})
                    </Text>
                    {response && response?.object?.length > 0 ? (
                        response?.object?.map((item:any) => (
                            <View key={item.id} style={styles.card}>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>Name:</Text>
                                    <Text style={styles.cardDetail}>{item.name || '-'}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>Phone:</Text>
                                    <Text style={styles.cardDetail}>{item.phone || '-'}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>Terminal:</Text>
                                    <Text style={styles.cardDetail}>{item.terminalName || '-'}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>Last Name:</Text>
                                    <Text style={styles.cardDetail}>{item.lastName || '-'}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>First Name:</Text>
                                    <Text style={styles.cardDetail}>{item.firstName || '-'}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>Email:</Text>
                                    <Text style={styles.cardDetail}>{item.email || '-'}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>INN:</Text>
                                    <Text style={styles.cardDetail}>{item.inn || '-'}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>Filial Code:</Text>
                                    <Text style={styles.cardDetail}>{item.filialCode || '-'}</Text>
                                </View>
                                <View style={styles.separator} />
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No user terminals found.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingVertical: Platform.OS === 'android' ? 35 : 0,
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 30,
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    cardDetail: {
        fontSize: 16,
        color: '#666',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
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
