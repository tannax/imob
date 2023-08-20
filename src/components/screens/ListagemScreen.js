import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const ListagemScreen = () => {
  const [cadastros, setCadastros] = useState([]);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      const newDb = await openDatabase({
        name: 'mydatabase.db',
        location: 'default',
      });
      setDb(newDb);
      fetchData(newDb);
    };

    initializeDatabase();
  }, []);

  const fetchData = dbInstance => {
    dbInstance.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM cadastros',
        [],
        (_, result) => {
          const data = [];
          for (let i = 0; i < result.rows.length; i++) {
            data.push(result.rows.item(i));
          }
          setCadastros(data);
        },
        error => {
          console.log(error);
        }
      );
    });
  };

  const renderCadastro = ({ item }) => (
    <View style={styles.cadastroContainer}>
      <Text>Endereço: {item.endereço}</Text>
      <Text>Finalidade: {item.finalidade}</Text>
      <Text>Tipo: {item.tipo}</Text>
      <Text>Valor: {item.valor}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listagem de Cadastros</Text>
      <FlatList
        data={cadastros}
        renderItem={renderCadastro}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cadastroContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});

export default ListagemScreen;
