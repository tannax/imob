import React from 'react';
import { View, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Button title="Cadastrar Propriedade" onPress={() => navigation.navigate('Cadastro')} />
      <Button title="Listagem de Cadastros" onPress={() => navigation.navigate('Listagem')} />
    </View>
  );
};

export default HomeScreen;
