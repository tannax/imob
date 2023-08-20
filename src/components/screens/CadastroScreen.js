import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import SQLiteStorage from 'react-native-sqlite-storage';
import { RNCamera } from 'react-native-camera';

const CadastroScreen = ({ navigation }) => {
  const [endereço, setEndereço] = useState('');
  const [finalidade, setFinalidade] = useState('');
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');

  const [db, setDb] = useState(null);
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    const newDb = SQLiteStorage.openDatabase({
      name: 'mydatabase.db',
      location: 'default',
    });
    setDb(newDb);

    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  const handleCadastro = () => {
    if (endereço === '' || finalidade === '' || tipo === '' || valor === '') {
      alert('Please fill out all of the required fields.');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS cadastros (
          id INTEGER PRIMARY KEY,
          endereço TEXT,
          finalidade TEXT,
          tipo TEXT,
          valor REAL,
          foto BLOB
        )
        `
      );

      tx.executeSql(
        'INSERT INTO cadastros (endereço, finalidade, tipo, valor, foto) VALUES (?, ?, ?, ?, ?)',
        [endereço, finalidade, tipo, valor, foto],
        (tx, result) => {
          console.log('Cadastro inserido com sucesso!');
          navigation.navigate('ListagemScreen');
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  const handleImagePicker = () => {
    const options = {
      title: 'Selecione uma imagem',
      mediaType: 'photo',
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets[0]) {
        setFoto(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro Screen</Text>
      <TextInput
        placeholder="Endereço"
        placeholderTextColor="#000"
        value={endereço}
        onChangeText={setEndereço}
        style={styles.input}
      />
      <TextInput
        placeholder="Finalidade"
        placeholderTextColor="#000"
        value={finalidade}
        onChangeText={setFinalidade}
        style={styles.input}
      />
      <TextInput
        placeholder="Tipo"
        placeholderTextColor="#000"
        value={tipo}
        onChangeText={setTipo}
        style={styles.input}
      />
      <TextInput
        placeholder="Valor"
        placeholderTextColor="#000"
        value={valor}
        onChangeText={setValor}
        style={styles.input}
      />
      <Button title="Selecionar Imagem" onPress={handleImagePicker} />
      {foto && <Image style={styles.image} source={{ uri: foto }} />}
      <Button title="Cadastrar" onPress={handleCadastro} />
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      >
        {({ camera, status }) => {
          if (status !== 'READY') return null;
          return (
            <View style={styles.cameraButtonContainer}>
              <Button title="Take Picture" onPress={() => handleImageTaken(camera)} />
            </View>
          );
        }}
      </RNCamera>
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default CadastroScreen;
