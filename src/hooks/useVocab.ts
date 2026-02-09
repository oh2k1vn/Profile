import { useState, useCallback } from "react";
import { topics, loadTopicData, loadAllData } from "../data/topics";
import type { VocabItem } from "../types/vocab";

export type LearningMode = "TOPIC" | "RANDOM";

export type SessionType = "LEARN" | "PRACTICE";

export interface UseVocabReturn {
  currentMode: LearningMode | null;
  currentTopic: string | null;
  sessionType: SessionType | null;
  queue: VocabItem[];
  currentIndex: number;
  currentCard: VocabItem | null;
  history: Set<number>;
  progress: number;
  isLoading: boolean;
  topics: readonly string[];
  startTopic: (topic: string, type: SessionType) => Promise<void>;
  startRandom: (type: SessionType) => Promise<void>;
  nextCard: () => void;
  prevCard: () => void;
  exitSession: () => void;
}

export function useVocab(): UseVocabReturn {
  const [currentMode, setCurrentMode] = useState<LearningMode | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [queue, setQueue] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Use the pre-calculated topics from the generator
  const availableTopics = topics;

  const startTopic = useCallback(async (topic: string, type: SessionType) => {
    setIsLoading(true);
    try {
      const topicData = await loadTopicData(topic);
      const topicItems = topicData.data;

      const shuffled = [...topicItems].sort(() => Math.random() - 0.5);

      setQueue(shuffled);
      setCurrentIndex(0);
      setCurrentMode("TOPIC");
      setCurrentTopic(topic);
      setSessionType(type);
    } catch (error) {
      console.error("Failed to load topic data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startRandom = useCallback(
    async (type: SessionType) => {
      setIsLoading(true);
      try {
        const allDataChunks = await loadAllData();
        const allItems = allDataChunks.flatMap((chunk) => chunk.data);

        // Smart random: pick items NOT in history
        let candidates = allItems.filter(
          (item: VocabItem) => !history.has(item.id),
        );

        // If we've seen everything (or almost everything), clear history to restart
        if (candidates.length === 0) {
          setHistory(new Set());
          candidates = allItems;
        }

        // Shuffle all candidates
        const shuffled = [...candidates].sort(() => Math.random() - 0.5);

        setQueue(shuffled);
        setCurrentIndex(0);
        setCurrentMode("RANDOM");
        setCurrentTopic(null);
        setSessionType(type);
      } catch (error) {
        console.error("Failed to load random data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [history],
  );

  const nextCard = useCallback(() => {
    if (queue.length === 0) return;

    // Add current card to history if in Random mode
    if (currentMode === "RANDOM") {
      const currentItem = queue[currentIndex];
      setHistory((prev) => new Set(prev).add(currentItem.id));
    }

    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // End of session? For now, just stay at end or maybe loop?
      // Let's implement a simple "loop" or just stop.
      // User can click "Exit" or "Restart".
    }
  }, [queue, currentIndex, currentMode]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const exitSession = useCallback(() => {
    setCurrentMode(null);
    setCurrentTopic(null);
    setSessionType(null);
    setQueue([]);
    setCurrentIndex(0);
  }, []);

  const currentCard = queue[currentIndex] || null;
  const progress =
    queue.length > 0 ? ((currentIndex + 1) / queue.length) * 100 : 0;

  return {
    currentMode,
    currentTopic,
    sessionType,
    queue,
    currentIndex,
    currentCard,
    history,
    topics: availableTopics,
    startTopic,
    startRandom,
    nextCard,
    prevCard,
    exitSession,
    progress,
    isLoading,
  };
}
