// src/components/PhotographerCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function PhotographerCard({ photographer, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(photographer)}>
      <Image
        source={{ uri: photographer.profileImage || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{photographer.name || 'Photographer'}</Text>
        <Text style={styles.specialty}>{photographer.specialty || 'Photography'}</Text>
        <Text style={styles.location}>{photographer.location || 'Location not specified'}</Text>
        <Text style={styles.rating}>
          P {photographer.rating || '4.5'} ({photographer.reviewCount || '0'} reviews)
        </Text>
        <Text style={styles.price}>
          Starting from ${photographer.startingPrice || '100'}/session
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    color: '#f39c12',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
  },
});