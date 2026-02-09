import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "../components/Layout";
import { TopicCard } from "../components/TopicCard";
import { FlashcardSession } from "../components/FlashcardSession";
import { useVocab } from "../hooks/useVocab";
import { ArrowLeft, BookOpen, GraduationCap, Zap } from "lucide-react";

export function VocabPage() {
  const {
    topics: allTopics,
    startTopic,
    startRandom,
    nextCard,
    prevCard,
    exitSession,
    currentMode,
    sessionType,
    currentIndex,
    queue,
    currentCard,
    isLoading,
  } = useVocab();

  // Lifted reveal state to sync with ControlBar
  const [isRevealed, setIsRevealed] = useState(false);

  const handleNext = useCallback(() => {
    setIsRevealed(false);
    nextCard();
  }, [nextCard]);

  const handlePrev = useCallback(() => {
    setIsRevealed(false);
    prevCard();
  }, [prevCard]);

  // Sync state with card/session changes without extra render
  const [sessionKey, setSessionKey] = useState("");
  const currentKey = `${currentIndex}-${currentMode}-${sessionType}`;

  if (sessionKey !== currentKey) {
    setSessionKey(currentKey);
    setIsRevealed(false);
  }

  // Keyboard Support: Enter to Reveal/Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (!currentMode) return;

        if (!isRevealed) {
          // If in Learn mode, Reveal on Enter.
          // If in Practice mode, Enter is handled by the input field (submit).
          if (sessionType === "LEARN") {
            setIsRevealed(true);
          }
        } else if (currentIndex < queue.length - 1) {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentMode,
    isRevealed,
    currentIndex,
    queue.length,
    handleNext,
    sessionType,
  ]);

  if (!currentMode) {
    return (
      <Layout>
        <div className="space-y-10">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                Vocabulary Hub
              </div>
              <h2 className="text-5xl font-black bg-linear-to-r from-white via-blue-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                English Practice
              </h2>
              <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
                Elevate your skills with immersive flashcards and interactive
                practice sessions tailored to your pace.
              </p>
            </div>

            <div className="flex gap-2 p-2 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl">
              <button
                disabled={isLoading}
                onClick={() => startRandom("LEARN")}
                className="flex items-center gap-2.5 px-6 py-3 text-xs font-black text-blue-400 hover:text-white hover:bg-blue-600 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                <Zap className="w-4 h-4" /> Smart Learn
              </button>
              <div className="w-px bg-white/5 my-2" />
              <button
                disabled={isLoading}
                onClick={() => startRandom("PRACTICE")}
                className="flex items-center gap-2.5 px-6 py-3 text-xs font-black text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                <GraduationCap className="w-4 h-4" /> Mastery
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs rounded-3xl"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-blue-400">
                      Đang tải dữ liệu...
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {allTopics.map((topic, index) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                {/* Dynamic Glow Background */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-indigo-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <div className="relative h-full overflow-hidden p-4 bg-slate-950/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] hover:border-white/10 transition-all duration-500 flex flex-col items-stretch">
                  <TopicCard topic={topic} />

                  <div className="mt-8 grid grid-cols-2 gap-2.5">
                    <button
                      disabled={isLoading}
                      onClick={() => startTopic(topic, "LEARN")}
                      className="group/btn flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <BookOpen className="w-4 h-4 text-slate-400 group-hover/btn:text-white transition-colors" />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover/btn:text-white transition-colors">
                        Study
                      </span>
                    </button>

                    <button
                      disabled={isLoading}
                      onClick={() => startTopic(topic, "PRACTICE")}
                      className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <GraduationCap className="w-4 h-4 shadow-sm" />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                        Master
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 relative pb-24">
        <div className="flex items-center justify-between">
          <button
            onClick={exitSession}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Thoát
          </button>

          <div className="text-xs font-medium text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            {currentIndex + 1} / {queue.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.word}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FlashcardSession
                key={currentCard.word}
                currentCard={currentCard}
                sessionType={sessionType || "LEARN"}
                isRevealed={isRevealed}
                onReveal={() => setIsRevealed(true)}
              />

              {/* Enhanced Keyboard Navigation Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center gap-6 mt-12"
              >
                <div className="flex items-center gap-2 group cursor-help">
                  <kbd className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all shadow-lg">
                    ENTER
                  </kbd>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {isRevealed ? "Next Card" : "Reveal Answer"}
                  </span>
                </div>
                {!isRevealed && currentIndex > 0 && (
                  <div className="w-1 h-1 rounded-full bg-slate-800" />
                )}
                {!isRevealed && currentIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-2 group text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Back
                    </span>
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ControlBar Removed - Actions are now integrated into FlashcardSession */}
      </div>
    </Layout>
  );
}
