import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { rtDatabase } from './firebase';

function App() {
  const [nameInput, setNameInput] = useState('')
  const [nicknameInput, setNicknameInput] = useState('')
  const serverTime = rtDatabase.getServerTime().getTime();

  useEffect(() => {
    const onUserAdded = rtDatabase.ref('/users')
    .limitToLast(1)
    .on('child_added', snapshot => {
      const user = snapshot.val();
      if(user.createdAt > serverTime){
        Alert.alert(`Novo usuário adicionado: ${user.name}`)
      }
    })
    return () => rtDatabase.ref('/users').off('child_added', onUserAdded);
  }, [])


  const addUser = (name, nickname) => {
    if(!name || !nickname){
      Alert.alert('Preencha nome e sobrenome!!')
      return;
    }

    const newRef = rtDatabase.ref('users').push();
    newRef.set({
      name,
      nickname,
      createdAt: rtDatabase.getServerTime().getTime()
    })
    .then(() => {
      // Alert.alert(`Usuário ${name} adicionado`);
    })
    .finally(() => {
      setNameInput('');
      setNicknameInput('');
    })
  }

  const deleteUser = (name) => {
    let userKey;
    rtDatabase.ref('users').once('value')
    .then(value => {
      value.forEach(user => {
        if (user.val().name === name){
          userKey = user.key;
        }
      })
    }).finally(() => {
      if (!userKey) {
        Alert.alert(`Usuário ${name} não encontrado`);
        return;
      }
  
      rtDatabase.ref(`users/${userKey}`).remove().then(() => {
        Alert.alert(`Usuário ${name} removido com sucesso`);
      })
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>
        Adicione/delete o usuário
      </Text>
      <View style={styles.inputsContainer}>
        <TextInput 
          placeholder='nome'
          onChangeText={setNameInput}
          style={styles.input}
          value={nameInput}
        />
        <TextInput
          placeholder='apelido'
          onChangeText={setNicknameInput}
          style={styles.input}
          value={nicknameInput}
        />
      </View>
      <View style={styles.buttons}>
        <Button
          title={'Adicionar'}
          onPress={() => addUser(nameInput, nicknameInput)}
        />
        <Button
          title={'Apagar'}
          onPress={() => deleteUser(nameInput)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  inputsContainer: {
    alignItems: 'center',
    width: '100%'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
})

export default App;
