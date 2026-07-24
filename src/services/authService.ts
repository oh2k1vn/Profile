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
      displayName: existingData.displayName || user.displayName || 'Nguyễn Minh Hiếu',
      email: user.email || existingData.email || '',
      photoURL: user.photoURL || existingData.photoURL || '/images/avatar.webp',
      avatarUrl: existingData.avatarUrl || user.photoURL || '/images/avatar.webp',
      lastLogin: new Date().toISOString(),
    };
  } else {
    // Initial profile for new user
    profile = {
      uid: user.uid,
      displayName: user.displayName || 'Nguyễn Minh Hiếu',
      email: user.email || '',
      photoURL: user.photoURL || '/images/avatar.webp',
      avatarUrl: user.photoURL || '/images/avatar.webp',
      jobTitle: 'Middle Frontend & Mobile Developer',
      headline: 'Chuyên lập trình Flutter, React, TypeScript & Zalo Mini App',
      bio: '4+ năm kinh nghiệm phát triển phần mềm di động và ứng dụng web hiện đại.',
      location: 'TP. Hồ Chí Minh, Việt Nam',
      githubUrl: 'https://github.com/oh2k1vn',
      linkedinUrl: '',
      facebookUrl: '',
      websiteUrl: 'https://profile-17t.pages.dev',
      cvUrl: '',
      skillsText: 'React, TypeScript, Flutter, Zalo Mini App, Tailwind CSS, Vite, Firebase',
      skills: ['React', 'TypeScript', 'Flutter', 'Zalo Mini App', 'Tailwind CSS', 'Vite', 'Firebase'],
      role: 'admin',
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
