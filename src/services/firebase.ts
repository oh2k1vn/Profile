import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn(
    '⚠️ [Firebase Warning] VITE_FIREBASE_API_KEY chưa được cấu hình! ' +
    'Nếu bạn đang deploy trên Cloudflare Pages, hãy đảm bảo đã cấu hình biến môi trường VITE_* và RE-DEPLOY.'
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    (import.meta.env.VITE_FIREBASE_PROJECT_ID
      ? `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.asia-southeast1.firebasedatabase.app`
      : undefined),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth & Realtime Database
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const rtdb = getDatabase(app);
