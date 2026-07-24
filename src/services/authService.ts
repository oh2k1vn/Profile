import { signInWithPopup, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  avatarUrl?: string;
  jobTitle?: string;
  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  cvUrl?: string;
  skillsText?: string;
  skills?: string[];
  role?: 'admin' | 'user';
  lastLogin: string;
  createdAt?: string;
  updatedAt?: any;
}

/**
 * Sign in with Google Popup and save/update user document in Firestore 'users' collection.
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userRef = doc(db, 'users', user.uid);
  const existingDoc = await getDoc(userRef);

  let profile: UserProfile;

  if (existingDoc.exists()) {
    // Retain existing Firestore profile data and update last login
    const existingData = existingDoc.data() as UserProfile;
    profile = {
      ...existingData,
      uid: user.uid,
      displayName: existingData.displayName || user.displayName || '',
      email: user.email || existingData.email || '',
      photoURL: user.photoURL || existingData.photoURL || '',
      avatarUrl: existingData.avatarUrl || user.photoURL || '',
      lastLogin: new Date().toISOString(),
    };
  } else {
    // Initial profile for new user - only use data from Firebase auth, leave others empty
    profile = {
      uid: user.uid,
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      avatarUrl: user.photoURL || '',
      jobTitle: '',
      headline: '',
      bio: '',
      phone: '',
      location: '',
      githubUrl: '',
      linkedinUrl: '',
      facebookUrl: '',
      websiteUrl: '',
      cvUrl: '',
      skillsText: '',
      skills: [],
      role: 'user',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  }

  // Save / Update user information in Firestore 'users' collection with merge
  try {
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
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Check if current user is logged in
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
