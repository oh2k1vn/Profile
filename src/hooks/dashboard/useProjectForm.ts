import { useState } from 'react';
import type { CreateProjectInput } from '../../services/projectService';

interface UseProjectFormOptions {
  onSave: (input: CreateProjectInput, techText: string) => Promise<void>;
}

export function useProjectForm({ onSave }: UseProjectFormOptions) {
  const [projectInput, setProjectInput] = useState<CreateProjectInput>({
    title: '',
    category: 'Web App',
    shortDesc: '',
    longDesc: '',
    tech: [],
    github: 'https://github.com/oh2k1vn',
    demoUrl: '',
    simulationType: 'particles',
  });
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !projectInput.title.trim() || !projectInput.shortDesc.trim()) return;
    setSaving(true);
    try {
      await onSave(projectInput, techInput);
      setProjectInput({
        title: '',
        category: 'Web App',
        shortDesc: '',
        longDesc: '',
        tech: [],
        github: 'https://github.com/oh2k1vn',
        demoUrl: '',
        simulationType: 'particles',
      });
      setTechInput('');
    } finally {
      setSaving(false);
    }
  };

  return {
    state: {
      projectInput,
      techInput,
      saving,
    },
    actions: {
      setProjectInput,
      setTechInput,
      handleSubmit,
    },
  };
}
