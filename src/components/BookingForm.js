// src/components/BookingForm.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BookingForm({ photographerId, onBookingComplete }) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');

  const handleBooking = () => {
    if (onBookingComplete) {
      onBookingComplete({
        photographerId,
        date: date.toISOString(),
        notes,
      });
    }
    Alert.alert('Booking Requested', 'Your booking request has been submitted.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Session</Text>
      
      <Text style={styles.label}>Select Date:</Text>
      <Button
        title={date.toDateString()}
        onPress={() => setShowDatePicker(true)}
      />
      
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
      
      <Text style={styles.label}>Notes:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Additional notes or requirements..."
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      
      <Button title="Request Booking" onPress={handleBooking} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    minHeight: 80,
  },
});