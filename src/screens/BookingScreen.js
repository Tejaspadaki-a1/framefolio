// src/screens/BookingScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db, auth } from '../utils/firebase';
import { addDoc, collection } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BookingScreen({ route, navigation }) {
  const { photographer } = route.params;
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleBooking = async () => {
    try {
      const bookingRef = collection(db, 'bookings');
      await addDoc(bookingRef, {
        userId: auth.currentUser.uid,
        photographerId: photographer.id,
        photographerName: photographer.name || 'Unknown Photographer',
        name,
        notes,
        date: date.toISOString(),
        time: date.toLocaleTimeString(),
        status: 'pending',
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Booking confirmed!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to book.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Booking Notes</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Text style={styles.label}>Choose Date & Time</Text>
      <Button title={date.toLocaleString()} onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(e, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Button title="Confirm Booking" onPress={handleBooking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
});
