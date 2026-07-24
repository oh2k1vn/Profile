import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost, CreateBlogInput } from '../types/blog';
import { addBlogCategory } from './categoryService';

// Helper to generate SEO-friendly slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Estimate read time in minutes
export function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} phút đọc`;
}

export const createBlogPost = async (input: CreateBlogInput): Promise<string> => {
  const generatedSlug = input.slug?.trim() || slugify(input.title);
  const readTimeStr = calculateReadTime(input.content);
  const finalCategory = input.category?.trim() || 'Kỹ Thuật';

  // Automatically save new category to Firestore
  addBlogCategory(finalCategory).catch(() => {});

  const docRef = await addDoc(collection(db, 'blog_posts'), {
    title: input.title.trim(),
    slug: generatedSlug,
    summary: input.summary.trim() || input.content.slice(0, 140) + '...',
    content: input.content.trim(),
    coverImage: input.coverImage?.trim() || '',
    category: finalCategory,
    tags: input.tags || [],
    authorName: input.authorName || 'Nguyễn Minh Hiếu',
    readTime: readTimeStr,
    published: input.published ?? true,
    views: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateBlogPost = async (id: string, input: Partial<CreateBlogInput>): Promise<void> => {
  const docRef = doc(db, 'blog_posts', id);
  const updateData: Record<string, any> = {
    updatedAt: Timestamp.now(),
  };

  if (input.category !== undefined && input.category.trim()) {
    updateData.category = input.category.trim();
    addBlogCategory(input.category.trim()).catch(() => {});
  }
  if (input.title !== undefined) {
    updateData.title = input.title.trim();
    if (!input.slug) {
      updateData.slug = slugify(input.title);
    }
  }
  if (input.slug !== undefined && input.slug.trim()) {
    updateData.slug = input.slug.trim();
  }
  if (input.content !== undefined) {
    updateData.content = input.content.trim();
    updateData.readTime = calculateReadTime(input.content);
    if (!input.summary) {
      updateData.summary = input.content.slice(0, 140) + '...';
    }
  }
  if (input.summary !== undefined && input.summary.trim()) {
    updateData.summary = input.summary.trim();
  }
  if (input.coverImage !== undefined) updateData.coverImage = input.coverImage.trim();
  if (input.tags !== undefined) updateData.tags = input.tags;
  if (input.published !== undefined) updateData.published = input.published;

  await updateDoc(docRef, updateData);
};

export const fetchBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const docRef = doc(db, 'blog_posts', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPost;
  }
  return null;
};

export const deleteBlogPostById = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'blog_posts', id));
};
