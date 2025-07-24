// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../utils/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
  const [role, setRole] = useState('');
  const [photographers, setPhotographers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setRole(userData.role);

      if (userData.role === 'user') {
        fetchPhotographers();
      } else {
        fetchBookings(userId);
      }
    };

    fetchUser();
  }, []);

  const fetchPhotographers = async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'photographer'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setPhotographers(data);
  };

  const fetchBookings = async (photographerId) => {
    const q = query(collection(db, 'bookings'), where('photographerId', '==', photographerId));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => doc.data());
    setBookings(data);
  };

  const renderPhotographer = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PhotographerScreen', { photographer: item })}
    >
      <Image
        source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.email}</Text>
    </TouchableOpacity>
  );

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Booked by: {item.userEmail}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Notes: {item.notes}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {role}</Text>
      {role === 'user' ? (
        <FlatList
          data={photographers}
          renderItem={renderPhotographer}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  image: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 16 },
});
