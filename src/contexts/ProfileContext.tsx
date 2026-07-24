import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, collection, query, limit, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { updateUserProfileData } from '../services/profileService';
import type { UserProfileData } from '../services/profileService';

interface ProfileContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfileData>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  updateProfile: async () => {},
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Real-time listener for profile changes in Firestore
  useEffect(() => {
    let unSubProfile: (() => void) | null = null;

    const unSubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Clean up previous profile listener if any
      if (unSubProfile) {
        unSubProfile();
        unSubProfile = null;
      }

      if (currentUser) {
        // Authenticated user: Listen to their user document in real-time
        const userRef = doc(db, 'users', currentUser.uid);
        unSubProfile = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setProfile(snapshot.data() as UserProfileData);
          }
          setLoading(false);
        }, (err) => {
          console.error('Error in profile snapshot:', err);
          setLoading(false);
        });
      } else {
        // Visitor: Listen to the first user document in 'users' collection (portfolio owner)
        const q = query(collection(db, 'users'), limit(1));
        unSubProfile = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            setProfile(snapshot.docs[0].data() as UserProfileData);
          }
          setLoading(false);
        }, (err) => {
          console.error('Error in public profile snapshot:', err);
          setLoading(false);
        });
      }
    });

    return () => {
      unSubAuth();
      if (unSubProfile) unSubProfile();
    };
  }, []);

  const refreshProfile = async () => {
    // onSnapshot handles real-time updates automatically
  };

  const handleUpdateProfile = async (data: Partial<UserProfileData>) => {
    if (!user) return;
    await updateUserProfileData(user.uid, data);
  };

  return (
    <ProfileContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile,
        updateProfile: handleUpdateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
