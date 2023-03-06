import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  FlatList,
  Image,
  Keyboard
} from 'react-native';
import Toast from 'react-native-simple-toast';
import openSocket from 'socket.io-client';
const SERVER = `http://localhost:8000/`;
const NAME = '@asif';
const AVATAR = 'https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg';
const AVATAR1 = 'https://i1.wp.com/tricksmaze.com/wp-content/uploads/2017/10/Stylish-Girls-Profile-Pictures-11.jpg';

const App = () => {
  const [typing, setTyping] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  const chatMessage = () => {
    socketRef.current.on('chat-message', (messageObj) => {
      setMessages(prevMessages => [...prevMessages, messageObj]);
    });
  };

  useEffect(() => {
    socketRef.current = openSocket(SERVER);
    chatMessage();
  }, []);

  const sendMessage = () => {
    Keyboard.dismiss();
    if (typing && typing !== '') {
      const message = typing;
      setTyping('');
      const messageObj = {
        sender: NAME,
        avatar: AVATAR,
        message,
      };
      setMessages(prevMessages => [...prevMessages, messageObj]);
      socketRef.current.emit('chat-message', messageObj);
    } else {
      Toast.show(`Message can't be empty`);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.row}>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
        <View style={styles.rowText}>
          <Text style={styles.sender}>{item.sender}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StatusBar backgroundColor="lightseagreen" barStyle="light-content" />
        <Text style={styles.title}>Chat App</Text>
      </View>
      <FlatList data={messages} renderItem={renderItem} />
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.footer}>
          <TextInput
            underlineColorAndroid="transparent"
            onChangeText={text => setTyping(text)}
            style={styles.input}
            value={typing}
            autoFocus={true}
            placeholder="Type Message..."
            autoCapitalize="none"
            autoCorrect={true}
            keyboardType="default"
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={true}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Text style={styles.send}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default App;


   


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    height: 80,
    backgroundColor: 'lightseagreen',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  },
  rowText: {
    flex: 1
  },
  message: {
    fontSize: 18
  },
  sender: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 15
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 18,
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 10
  },
  send: {
    alignSelf: 'center',
    color: 'lightseagreen',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10
  },
  sendImage: {
    height: 30,
    width: 30
  }
});
