import { useState } from 'react';
import type { UserProfileData } from '../../services/profileService';
import { audioService } from '../../services/audioService';

interface UseUserFormOptions {
  user: UserProfileData;
  onSave: (updatedData: Partial<UserProfileData>) => Promise<void>;
}

export function useUserForm({ user, onSave }: UseUserFormOptions) {
  const [formData, setFormData] = useState<UserProfileData>({ ...user });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    audioService.playClick();
    setSaving(true);

    try {
      const skillsArray = (formData.skillsText || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Partial<UserProfileData> = {
        ...formData,
        skills: skillsArray,
      };

      await onSave(payload);
    } catch (err) {
      console.error('Error saving user profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = (role: 'admin' | 'user') => {
    audioService.playClick();
    setFormData((prev) => ({ ...prev, role }));
  };

  return {
    state: {
      formData,
      saving,
    },
    actions: {
      setFormData,
      handleRoleChange,
      handleSubmit,
    },
  };
}
