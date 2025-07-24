// src/screens/PhotographerScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, Button, StyleSheet } from 'react-native';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import RatingStars from '../components/RatingStars';

export default function PhotographerScreen({ route, navigation }) {
  const { photographer } = route.params;
  const [portfolio, setPortfolio] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetchPortfolio();
    fetchRatings();
  }, []);

  const fetchPortfolio = async () => {
    const q = query(collection(db, 'portfolio'), where('photographerId', '==', photographer.id));
    const querySnapshot = await getDocs(q);
    const images = querySnapshot.docs.map(doc => doc.data().imageUrl);
    setPortfolio(images);
  };

  const fetchRatings = async () => {
    const q = query(collection(db, 'ratings'), where('photographerId', '==', photographer.id));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => doc.data().rating);
    setRatings(data);
  };

  const averageRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'No Ratings';

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photographer.profileImage || 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{photographer.email}</Text>
      <Text style={styles.rating}>Rating: {averageRating} ⭐</Text>

      <Text style={styles.sectionTitle}>Portfolio</Text>
      <FlatList
        data={portfolio}
        horizontal
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.portfolioImage} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button
        title="Book Now"
        onPress={() => navigation.navigate('BookingScreen', { photographer })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  profileImage: { width: '100%', height: 200, borderRadius: 12 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  rating: { fontSize: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  portfolioImage: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
  },
});
