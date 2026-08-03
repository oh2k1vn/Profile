import { useState, useEffect } from 'react';
import type { BlogPost, CreateBlogInput } from '../../types/blog';
import { slugify } from '../../services/blogService';
import { fetchBlogCategories } from '../../services/categoryService';

interface UseBlogFormOptions {
  initialData?: BlogPost | null;
  onSave: (input: CreateBlogInput) => Promise<void>;
}

export function useBlogForm({ initialData, onSave }: UseBlogFormOptions) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch Firestore categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const fetched = await fetchBlogCategories();
      setCategories(fetched);
      if (fetched.length > 0 && !initialData) {
        setCategory(fetched[0]);
      }
    };
    loadCategories();
  }, [initialData]);

  // Sync initialData when editing or resetting
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || slugify(initialData.title || ''));
      setCategory(initialData.category || '');
      setSummary(initialData.summary || '');
      setCoverImage(initialData.coverImage || '');
      setContent(initialData.content || '');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
      setPublished(initialData.published ?? true);
      setIsCustomCategory(false);
    } else {
      setTitle('');
      setSlug('');
      setSummary('');
      setCoverImage('');
      setContent('');
      setTags('');
      setPublished(true);
      setIsCustomCategory(false);
    }
  }, [initialData]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !title.trim() || !content.trim()) return;
    setSaving(true);

    const finalCategory = isCustomCategory ? customCategoryInput.trim() : category;

    try {
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await onSave({
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        category: finalCategory || '',
        summary: summary.trim(),
        coverImage: coverImage.trim(),
        content: content.trim(),
        tags: tagsArray,
        published,
      });

      if (!initialData) {
        setTitle('');
        setSlug('');
        setSummary('');
        setCoverImage('');
        setContent('');
        setTags('');
        setPublished(true);
        setIsCustomCategory(false);
        setCustomCategoryInput('');
      }
    } finally {
      setSaving(false);
    }
  };

  return {
    state: {
      title,
      slug,
      categories,
      category,
      isCustomCategory,
      customCategoryInput,
      summary,
      coverImage,
      content,
      tags,
      published,
      saving,
    },
    actions: {
      setTitle: handleTitleChange,
      setSlug,
      setCategory,
      setIsCustomCategory,
      setCustomCategoryInput,
      setSummary,
      setCoverImage,
      setContent,
      setTags,
      setPublished,
      handleSubmit,
    },
  };
}
