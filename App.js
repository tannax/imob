/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../iMob/src/components/screens/HomeScreen';
import CadastroScreen from './src/components/screens/CadastroScreen';
import ListagemScreen from '../iMob/src/components/screens/ListagemScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="iMob">
        <Stack.Screen name="iMob" component={HomeScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Listagem" component={ListagemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
