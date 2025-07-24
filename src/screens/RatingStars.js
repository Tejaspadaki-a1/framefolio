// src/components/RatingStars.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { db, auth } from '../utils/firebase';
import { addDoc, collection } from 'firebase/firestore';

export default function RatingStars({ photographerId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const submitReview = async () => {
    await addDoc(collection(db, 'reviews'), {
      userId: auth.currentUser.uid,
      photographerId,
      rating,
      review,
      createdAt: new Date(),
    });
    setRating(0);
    setReview('');
    alert('Review submitted!');
  };

  return (
    <View style={{ flexDirection: 'column', marginVertical: 10 }}>
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <FontAwesome name="star" size={30} color={star <= rating ? 'gold' : 'gray'} />
          </TouchableOpacity>
        ))}
      </View>
      <Text>Write a review:</Text>
      <TextInput
        value={review}
        onChangeText={setReview}
        placeholder="Your review..."
        style={{ borderWidth: 1, padding: 5, marginVertical: 5 }}
      />
      <Button title="Submit" onPress={submitReview} />
    </View>
  );
}
