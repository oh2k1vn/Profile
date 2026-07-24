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
  let result;
  try {
    result = await signInWithPopup(auth, googleProvider);
  } catch (err: any) {
    console.error('Firebase Auth Error Code:', err?.code, err?.message);
    if (err?.code === 'auth/unauthorized-domain') {
      throw new Error(
        'Tên miền chưa được cấp quyền (unauthorized-domain). Hãy thêm domain Cloudflare vào Authorized Domains trong Firebase Console -> Authentication -> Settings.'
      );
    } else if (err?.code === 'auth/invalid-api-key') {
      throw new Error(
        'Firebase API Key không hợp lệ. Hãy kiểm tra biến môi trường VITE_FIREBASE_API_KEY trên Cloudflare Pages và Re-deploy.'
      );
    }
    throw err;
  }
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
