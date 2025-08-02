import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const OrdersScreen = () =e {
  const { orders } = useSelector((state) =e state.orders);

  const renderOrder = ({ item }) =e (
    cView style={styles.orderContainer}e
      cText style={styles.orderTitle}eOrder #{item.id}c/Texte
      cTexteCustomer: {item.customerName}c/Texte
      cTexteTotal: ${item.total}c/Texte
    c/Viewe
  );

  return (
    cSafeAreaView style={styles.container}e
      cFlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) =e item.id?.toString()}
      /e
    c/SafeAreaViewe
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default OrdersScreen;

