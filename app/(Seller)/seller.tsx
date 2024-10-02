import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useGlobalRequest } from '@/helpers/apifunctions/univesalFunc';
import { SellerEdit, SellerGet } from '@/helpers/url';

interface Terminal {
  id: string; // Assuming there is an 'id' field
  name: string;
  account: string;
  filial_code: string;
  phones: string[];
}

interface TerminalNewUser {
  phone: string;
  password: string;
}

const Seller: React.FC = () => {
  const [terminalNewUsers, setTerminalNewUsers] = useState<TerminalNewUser[]>([{ phone: '', password: '' }]);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const {
    loading: loadingTerminals,
    error: errorTerminals,
    response: terminalList,
    globalDataFunc: fetchTerminalList,
  } = useGlobalRequest<{ object: Terminal[] }>(SellerGet, 'GET');

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    globalDataFunc: updateTerminal,
  } = useGlobalRequest(selectedTerminal ? `${SellerEdit}${selectedTerminal?.id}` : '', 'PUT', selectedTerminal);

  useEffect(() => {
    fetchTerminalList();
  }, [fetchTerminalList]);

  const handleAddPhoneNumber = () => {
    setTerminalNewUsers([...terminalNewUsers, { phone: '', password: '' }]);
  };

  const handleRemovePhoneNumber = (index: number) => {
    const updatedList = terminalNewUsers.filter((_, i) => i !== index);
    setTerminalNewUsers(updatedList);
  };

  const handleList = (name: keyof TerminalNewUser, value: string, index: number) => {
    const updatedUsers = [...terminalNewUsers];
    updatedUsers[index][name] = value;
    setTerminalNewUsers(updatedUsers);
  };

  const handleTerminalChange = (name: keyof Terminal, value: string) => {
    setSelectedTerminal((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateTerminal();
      console.log('Terminal updated successfully');
      setModalVisible(false);
    } catch (e) {
      console.error('Failed to update terminal:', e);
    }
  };

  const toggleModal = (terminal: Terminal) => {
    setSelectedTerminal(terminal);
    setModalVisible(true);
  };

  if (errorTerminals) return <Text>Error: {errorTerminals.message}</Text>;

  return (
    <View>
      <Text style={styles.title}>Terminals</Text>

      {loadingTerminals ? <ActivityIndicator size="large" color="#0000ff" /> : terminalList && terminalList.object.length > 0 ? (
        terminalList.object.map((terminal: Terminal, index: number) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => toggleModal(terminal)}>
            <Text style={styles.cardTitle}>{terminal.account}</Text>
            <Text style={styles.cardText}>Name: {terminal.name}</Text>
            <Text style={styles.cardText}>Filial Code: {terminal.filial_code}</Text>
            <Text style={styles.cardText}>Phone: {terminal?.phones?.[0]}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No Terminals Found</Text>
      )}

      {selectedTerminal && (
        <Modal visible={isModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Terminal</Text>

              <TextInput
                value={selectedTerminal.name}
                onChangeText={(text) => handleTerminalChange('name', text)}
                placeholder="Name"
                style={styles.input}
              />

              <TextInput
                value={selectedTerminal.account}
                onChangeText={(text) => handleTerminalChange('account', text)}
                placeholder="Account"
                style={styles.input}
              />

              <TextInput
                value={selectedTerminal?.phones?.[0] || ''}
                onChangeText={(text: string) => handleTerminalChange('phones', [text])}
                placeholder="Phone"
                style={styles.input}
              />

              <Button title="Update Terminal" onPress={handleSubmit} disabled={loadingUpdate} />
              {errorUpdate && <Text>Error updating terminal: {errorUpdate.message}</Text>}
              <View style={styles.addPhoneSection}>
                <Text>Phone</Text>
                <TouchableOpacity onPress={handleAddPhoneNumber}>
                  <AntDesign name="pluscircle" size={24} color="black" />
                </TouchableOpacity>
              </View>

              {terminalNewUsers.map((user, index) => (
                <View key={index} style={styles.phoneRow}>
                  <Text style={styles.phoneCode}>+998</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder={`Phone ${index + 1}`}
                    keyboardType="numeric"
                    value={user.phone}
                    onChangeText={(text) => handleList('phone', text, index)}
                  />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder={`Password ${index + 1}`}
                    secureTextEntry
                    value={user.password}
                    onChangeText={(text) => handleList('password', text, index)}
                  />
                  {index > 0 && (
                    <TouchableOpacity onPress={() => handleRemovePhoneNumber(index)}>
                      <AntDesign name="minuscircle" size={24} color="black" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  addPhoneSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  phoneCode: {
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    borderBottomWidth: 1,
    marginRight: 10,
  },
  passwordInput: {
    flex: 1,
    borderBottomWidth: 1,
  },
});

export default Seller;
