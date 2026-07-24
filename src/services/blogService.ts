import { collection, addDoc, doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost } from '../types/blog';

export const createBlogPost = async (title: string, content: string, tags: string[]): Promise<string> => {
  const docRef = await addDoc(collection(db, 'blog_posts'), {
    title: title.trim(),
    content: content.trim(),
    tags,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
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
