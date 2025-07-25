// src/screens/ChatScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

export default function ChatScreen({ route }) {
  const { chatId, otherUserId, otherUserName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (inputText.trim()) {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: inputText,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email,
      });
      setInputText('');
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.userId === auth.currentUser.uid;
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUser : styles.otherUser]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {item.createdAt ? item.createdAt.toLocaleTimeString() : ''}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  currentUser: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  otherUser: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
