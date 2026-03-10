import { atom } from "jotai";

export type TabType = "home" | "tasks" | "rewards" | "campaigns" | "profile";

export const activeTabAtom = atom<TabType>("home");
