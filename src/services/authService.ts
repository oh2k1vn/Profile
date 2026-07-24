import { signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  lastLogin: string;
}

/**
 * Sign in with Google Popup and save/update user document in Firestore 'users' collection.
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const profile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || 'Khách',
    email: user.email || '',
    photoURL: user.photoURL || '',
    lastLogin: new Date().toISOString(),
  };

  // Save / Update user information in Firestore 'users' collection
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore write warning:', err);
  }

  return profile;
}

/**
 * Sign out current user.
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Get currently authenticated user.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
