import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface BlogCategory {
  id: string;
  name: string;
  authorId?: string;
  authorName?: string;
  createdAt?: any;
}

export const fetchBlogCategoryObjects = async (): Promise<BlogCategory[]> => {
  try {
    const q = query(collection(db, 'blog_categories'), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(d => ({
      id: d.id,
      name: d.data().name as string,
      authorId: d.data().authorId,
      authorName: d.data().authorName,
      createdAt: d.data().createdAt,
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error('Error fetching blog category objects from Firestore:', err);
    return [];
  }
};

export const fetchBlogCategories = async (): Promise<string[]> => {
  const objects = await fetchBlogCategoryObjects();
  return Array.from(new Set(objects.map(o => o.name)));
};

export const addBlogCategory = async (categoryName: string, authorId?: string, authorName?: string): Promise<string> => {
  const trimmed = categoryName.trim();
  if (!trimmed) throw new Error('Category name cannot be empty');

  const existing = await fetchBlogCategories();
  if (existing.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error('Category already exists');
  }

  const docRef = await addDoc(collection(db, 'blog_categories'), {
    name: trimmed,
    authorId: authorId || '',
    authorName: authorName || '',
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const deleteBlogCategory = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'blog_categories', id));
};
