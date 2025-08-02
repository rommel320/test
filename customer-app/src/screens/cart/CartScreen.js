import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  setDeliveryFee,
} from '../../redux/slices/cartSlice';
import { createOrder } from '../../redux/slices/orderSlice';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    try {
      const orderData = {
        restaurantId: cart.restaurantId,
        items: cart.items,
        subtotal: cart.subtotal,
        deliveryFee: cart.deliveryFee,
        tax: cart.tax,
        total: cart.total,
      };
      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigation.navigate('OrderTracking');
    } catch (error) {
      Alert.alert('Checkout Failed', error);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity - 1 }))}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => dispatch(updateQuantity({ itemId: item.id, quantity: item.quantity + 1 }))}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => handleRemoveItem(item.id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cart.items}
        renderItem={renderCartItem}
        keyExtractor={(item) =e item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Subtotal: ${cart.subtotal.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Delivery Fee: ${cart.deliveryFee.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Tax: ${cart.tax.toFixed(2)}</Text>
        <Text style={styles.totalText}>Total: ${cart.total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    padding: 20,
  },
  cartItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    padding: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 5,
  },
  removeButtonText: {
    color: '#ff6b35',
    fontWeight: 'bold',
  },
  summary: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    margin: 20,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CartScreen;

