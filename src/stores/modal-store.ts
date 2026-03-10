import { atom } from "jotai";
import { ReactNode } from "react";

export type ModalType = "bottom-sheet" | "dialog";

export interface ModalInstance {
  id: string;
  type: ModalType;
  content: ReactNode;
  props?: Record<string, any>;
}

// Atom to store the stack of active modals
export const modalStackAtom = atom<ModalInstance[]>([]);
