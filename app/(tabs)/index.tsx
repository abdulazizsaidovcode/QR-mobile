import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, Dimensions, StatusBar } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import TransactionCard from '@/components/cards/tranzaktionCards';
import TransactionActionCard from '@/components/cards/tranzaktionActionCards';
import { FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { FlatList } from 'react-native';
import TransactionActionHeadCard from '@/components/cards/tranzaktionActionCardsHead';
import Navbar from '@/components/navbar/navbar';

export default function HomeScreen() {
  const transactions = [
    { id: 1, title: 'Netflix Payment', date: 'Today 13.30', amount: -26.42 },
    { id: 2, title: "YouTube Creator's", date: 'Today 07.01', amount: 3.43 },
    { id: 3, title: 'Transfer from Alex', date: 'Yesterday 19.32', amount: 30.33 },
    { id: 4, title: 'Transfer from Alex', date: 'Yesterday 19.32', amount: 30.33 },
    { id: 5, title: 'Transfer from Alex', date: 'Yesterday 19.32', amount: 30.33 },
    { id: 6, title: 'Transfer from Alex', date: 'Yesterday 19.32', amount: 30.33 },
    { id: 7, title: 'Transfer from Alex', date: 'Yesterday 19.32', amount: 30.33 },
    // Add more transactions as needed
  ];
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#f5f5f5' }}
      headerImage={ <Image source={require('./../../assets/images/Wallet Card.png')}  />}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={{ marginBottom: 40 }}>
        <View style={{ flexDirection: 'row', gap: 5, }}>
          <TransactionActionCard
            title="Terminals"
            desc='3'
            icon={<FontAwesome5 name="calculator" size={26} color={Colors.light.primary} />} // Pass the icon as a prop
            onPress={() => console.log('Send Money Pressed')}
          />
          <TransactionActionCard
            title="Cancelled transactions"
            desc='10'
            icon={<MaterialIcons name="money-off" size={36} color={Colors.light.primary} />} // Another icon
            onPress={() => console.log('Receive Money Pressed')}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
          <TransactionActionCard
            title="Number of terminal users"
            desc='47'
            icon={<FontAwesome5 name="users" size={26} color={Colors.light.primary} />} // Pass the icon as a prop
            onPress={() => console.log('Send Money Pressed')}
          />
          <TransactionActionCard
            title="Transactions"
            desc='1'
            icon={<FontAwesome6 name="money-bill-transfer" size={26} color={Colors.light.primary} />} // Another icon
            onPress={() => console.log('Receive Money Pressed')}
          />
          <TransactionActionHeadCard
            title=" Overall balance"
            desc='20,234354'
            icon={<FontAwesome5 name="money-bill" size={36} color={Colors.light.primary} />} // Another icon
            onPress={() => console.log('Receive Money Pressed')}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Latest Transactions</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          data={transactions}
          // keyExtractor={(item) => item.id} // Use a unique key for each item
          renderItem={({ item }) => (
            <TransactionCard transaction={item} />
          )}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: Colors.dark.primary,
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: Colors.dark.primary,
  },
});
