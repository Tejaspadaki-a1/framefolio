// src/screens/ChatScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../utils/firebase';

export default function ChatScreen({ route }) {
  const { chatId, otherUserId, otherUserName } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    const msg = newMessages[0];
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      _id: msg._id,
      text: msg.text,
      createdAt: new Date(),
      user: {
        _id: auth.currentUser.uid,
        name: auth.currentUser.email,
      },
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(msgs) => onSend(msgs)}
      user={{
        _id: auth.currentUser.uid,
      }}
      placeholder="Type a message..."
      showUserAvatar
    />
  );
}
