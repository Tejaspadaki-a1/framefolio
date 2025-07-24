// src/utils/roleCheck.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const checkUserRole = async (uid) => {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data().role; // returns 'user' or 'photographer'
  } else {
    return null;
  }
};
