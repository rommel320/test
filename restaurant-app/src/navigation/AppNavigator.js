import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import MenuScreen from '../screens/menu/MenuScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Restaurant Owner Stack
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        </>
      ) : (
        // Authentication Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
