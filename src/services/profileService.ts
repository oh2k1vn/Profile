import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfileData {
  uid: string;
  displayName: string;
  jobTitle?: string;
  bio?: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  skillsText?: string;
  lastLogin?: string;
}

export const fetchUserProfileData = async (uid: string): Promise<UserProfileData | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfileData;
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
