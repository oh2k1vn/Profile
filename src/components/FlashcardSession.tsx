import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, RefreshCcw } from "lucide-react";
import { Flashcard } from "./Flashcard";
import { type SessionType } from "../hooks/useVocab";
import type { VocabItem } from "../types/vocab";

interface FlashcardSessionProps {
  currentCard: VocabItem;
  sessionType: SessionType;
  isRevealed: boolean;
  onReveal: () => void;
}

export function FlashcardSession({
  currentCard,
  sessionType,
  isRevealed,
  onReveal,
}: FlashcardSessionProps) {
  const [inputValue, setInputValue] = useState("");
  const [inputStatus, setInputStatus] = useState<
    "idle" | "correct" | "incorrect" | "given_up"
  >("idle");
  const [maskedWord, setMaskedWord] = useState(() =>
    currentCard.word.replace(/[a-zA-Z]/g, "_"),
  );

  const handleInputChange = (val: string) => {
    if (inputStatus === "correct" || inputStatus === "given_up") return;
    setInputValue(val);
    setInputStatus("idle");
  };

  const submitInput = () => {
    if (isRevealed) return;

    if (
      inputValue.toLowerCase().trim() === currentCard.word.toLowerCase().trim()
    ) {
      setInputStatus("correct");
      onReveal();
    } else {
      setInputStatus("incorrect");
    }
  };

  const giveUp = () => {
    setInputStatus("given_up");
    onReveal();
  };

  const hint = () => {
    const word = currentCard.word;
    const currentMask = maskedWord.split("");
    const hiddenIndices = currentMask
      .map((char, i) => (char === "_" ? i : -1))
      .filter((i) => i !== -1);

    if (hiddenIndices.length > 0) {
      const randomIndex =
        hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
      currentMask[randomIndex] = word[randomIndex];
      setMaskedWord(currentMask.join(""));
    }
  };

  return (
    <div className="relative group/session w-full max-w-2xl mx-auto">
      {/* Background Glow Effect */}
      <div className="absolute -inset-4 bg-linear-to-r from-blue-500/10 to-indigo-500/10 blur-3xl opacity-0 group-hover/session:opacity-100 transition-opacity duration-1000 -z-10" />

      <Flashcard
        card={currentCard}
        isRevealed={isRevealed}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        inputStatus={inputStatus}
        onInputSubmit={submitInput}
        mode={sessionType}
        onHint={hint}
        onGiveUp={giveUp}
        maskedWord={maskedWord}
        onReveal={onReveal}
      />

      <div className="mt-8 flex items-center justify-center gap-4 px-2">
        {/* Central Action / Status */}
        <div className="flex-1 flex justify-center">
          <AnimatePresence mode="wait">
            {sessionType === "LEARN" && !isRevealed ? (
              <motion.button
                key="reveal-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={onReveal}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-100 hover:bg-white text-slate-950 font-black text-sm transition-all active:scale-95 shadow-2xl shadow-white/5 border border-white/10"
              >
                <Eye className="w-5 h-5" />
                <span>REVEAL ANSWER</span>
              </motion.button>
            ) : isRevealed ? (
              <motion.div
                key="next-status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
              >
                <RefreshCcw className="w-3 h-3 animate-spin-reverse" />
                Card Revealed
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Tip */}
      {!isRevealed && sessionType === "PRACTICE" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest"
        >
          Press <span className="text-slate-300">Enter</span> to submit your
          answer
        </motion.p>
      )}
    </div>
  );
}
