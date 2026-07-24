import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Project, SimulationType } from '../types/project';

export interface CreateProjectInput {
  title: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  tech: string[];
  github: string;
  demoUrl?: string;
  simulationType: SimulationType;
}

export const fetchProjectsFromFirestore = async (): Promise<Project[]> => {
  const querySnapshot = await getDocs(collection(db, 'projects'));
  const projects: Project[] = [];
  querySnapshot.forEach((docSnap) => {
    projects.push({
      id: docSnap.id,
      ...docSnap.data(),
    } as Project);
  });
  return projects;
};

export const createProjectInFirestore = async (input: CreateProjectInput): Promise<string> => {
  const docRef = await addDoc(collection(db, 'projects'), {
    ...input,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateProjectInFirestore = async (id: string, input: Partial<CreateProjectInput>): Promise<void> => {
  const docRef = doc(db, 'projects', id);
  await updateDoc(docRef, {
    ...input,
    updatedAt: Timestamp.now(),
  });
};

export const deleteProjectInFirestore = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'projects', id));
};
