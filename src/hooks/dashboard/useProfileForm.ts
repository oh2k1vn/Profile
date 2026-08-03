import type { UserProfileData } from '../../services/profileService';

interface UseProfileFormOptions {
  profile: UserProfileData;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileData | null>>;
  onSaveProfile: (e: React.FormEvent) => void;
}

export function useProfileForm({ profile: _profile, setProfile, onSaveProfile }: UseProfileFormOptions) {
  const updateField = <K extends keyof UserProfileData>(field: K, value: UserProfileData[K]) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleAvatarChange = (url: string) => {
    setProfile((prev) =>
      prev ? { ...prev, avatarUrl: url, photoURL: url } : null
    );
  };

  return {
    actions: {
      updateField,
      handleAvatarChange,
      handleSubmit: onSaveProfile,
    },
  };
}
