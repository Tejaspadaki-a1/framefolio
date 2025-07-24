// src/utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDmZf9CJHCh9PcVnICm1rtgBnA4DEogjDU",
  authDomain: "framefolio-7239d.firebaseapp.com",
  projectId: "framefolio-7239d",
  storageBucket: "framefolio-7239d.appspot.com",
  messagingSenderId: "306363815928",
  appId: "1:306363815928:android:60999fc2ffcbeafe38e80d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
