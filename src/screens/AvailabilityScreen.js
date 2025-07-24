// src/screens/AvailabilityScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from '../utils/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export default function AvailabilityScreen() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newDate, setNewDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const fetchAvailability = async () => {
    const q = query(
      collection(db, 'availability'),
      where('photographerId', '==', auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    const slots = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAvailableSlots(slots);
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const addSlot = async () => {
    try {
      await addDoc(collection(db, 'availability'), {
        photographerId: auth.currentUser.uid,
        availableAt: newDate.toISOString(),
        createdAt: new Date(),
      });
      Alert.alert('Slot added!');
      fetchAvailability();
    } catch (error) {
      Alert.alert('Error', 'Could not add availability.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Availability</Text>

      <Button title="Pick Date & Time" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={newDate}
          mode="datetime"
          display="default"
          onChange={(e, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setNewDate(selectedDate);
          }}
        />
      )}

      <Button title="Add Slot" onPress={addSlot} />

      <Text style={styles.subTitle}>Marked Slots:</Text>
      <FlatList
        data={availableSlots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.slot}>{new Date(item.availableAt).toLocaleString()}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { fontWeight: '600', marginTop: 20, marginBottom: 5 },
  slot: { borderBottomWidth: 1, paddingVertical: 5 },
});
