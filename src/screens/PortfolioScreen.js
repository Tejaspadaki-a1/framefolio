// src/screens/PortfolioScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { auth, storage } from '../utils/firebase';

export default function PortfolioScreen() {
  const [images, setImages] = useState([]);

  const loadImages = async () => {
    const folderRef = ref(storage, `portfolio/${auth.currentUser.uid}`);
    const result = await listAll(folderRef);
    const urls = await Promise.all(result.items.map((imgRef) => getDownloadURL(imgRef)));
    setImages(urls);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert('Permission denied to access gallery.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      const img = result.assets[0];
      await uploadImage(img.uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `${Date.now()}.jpg`;
      const imgRef = ref(storage, `portfolio/${auth.currentUser.uid}/${filename}`);
      await uploadBytes(imgRef, blob);
      Alert.alert('Image uploaded!');
      loadImages();
    } catch (err) {
      Alert.alert('Error uploading image');
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Portfolio</Text>
      <Button title="Upload Image" onPress={pickImage} />

      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.imageContainer}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  imageContainer: { marginTop: 10 },
  image: { width: '48%', height: 150, margin: '1%' },
});
