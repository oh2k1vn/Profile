import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Thay thế bằng Firebase config thật của bạn
// Lấy từ Firebase Console → Project Settings → Your apps → SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoP1q5CkhY1WB3tO_AzYRivTy76-77-no",
  authDomain: "project-2e604.firebaseapp.com",
  databaseURL: "https://project-2e604-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-2e604",
  storageBucket: "project-2e604.firebasestorage.app",
  messagingSenderId: "685934003093",
  appId: "1:685934003093:web:652b48d2ef4a6484caac9c",
  measurementId: "G-P7W1CRC2YF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
