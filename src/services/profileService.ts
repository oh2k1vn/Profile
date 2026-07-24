import { doc, getDoc, setDoc, collection, query, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from './authService';

export type UserProfileData = UserProfile;

export const fetchUserProfileData = async (uid: string): Promise<UserProfileData | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfileData;
  }
  return null;
};

export const fetchPublicOwnerProfile = async (): Promise<UserProfileData | null> => {
  try {
    const q = query(collection(db, 'users'), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as UserProfileData;
    }
  } catch (err) {
    console.error('Error fetching public owner profile from Firestore:', err);
  }
  return null;
};

export const updateUserProfileData = async (uid: string, data: Partial<UserProfileData>): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const fetchAllUsers = async (): Promise<UserProfileData[]> => {
  try {
    const q = query(collection(db, 'users'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserProfileData);
  } catch (err) {
    console.error('Error fetching all users from Firestore:', err);
    return [];
  }
};

export const updateUserRole = async (uid: string, role: 'admin' | 'user'): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, {
    role,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

