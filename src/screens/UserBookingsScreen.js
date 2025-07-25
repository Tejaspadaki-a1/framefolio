// src/screens/UserBookingsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

export default function UserBookingsScreen() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const q = query(collection(db, 'bookings'), where('userId', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    };
    fetchBookings();
  }, []);

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ margin: 10, padding: 10, backgroundColor: '#eee' }}>
          <Text>Photographer: {item.photographerName}</Text>
          <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
          <Text>Time: {item.time}</Text>
          <Text>Notes: {item.notes}</Text>
        </View>
      )}
    />
  );
}
