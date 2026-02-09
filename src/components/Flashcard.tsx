import { motion, AnimatePresence } from "framer-motion";
import { Tag, Lightbulb } from "lucide-react";
import type { VocabItem } from "../types/vocab";
import type { SessionType } from "../hooks/useVocab";
import { cn } from "../lib/utils";

interface FlashcardProps {
  card: VocabItem;
  onReveal?: () => void;
  isRevealed: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  inputStatus: "idle" | "correct" | "incorrect" | "given_up";
  onInputSubmit: () => void;
  mode: SessionType;
  onHint?: () => void;
  onGiveUp?: () => void;
  maskedWord?: string;
}

export function Flashcard({
  card,
  isRevealed,
  inputValue,
  onInputChange,
  inputStatus,
  onInputSubmit,
  mode,
  onHint,
  onGiveUp,
  maskedWord,
}: FlashcardProps) {
  const isPractice = mode === "PRACTICE";

  return (
    <div className="w-full max-w-lg mx-auto relative min-h-[400px]">
      <div
        className={cn(
          "w-full h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col",
          isRevealed
            ? "border-slate-700 bg-slate-900"
            : "hover:border-slate-700",
          isPractice &&
            (inputStatus === "correct" || inputStatus === "given_up") &&
            "border-green-500/50 shadow-green-900/20",
          isPractice &&
            inputStatus === "incorrect" &&
            "border-red-500/50 shadow-red-900/20",
        )}
      >
        <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6 flex-1">
          {/* Main Word Section - Hidden if not revealed (except for typing hint?) */}
          {/* Actually, show word only if revealed or special mode? 
              User wants to LEARN and PRACTICE. Usually prompt is Meaning, Answer is Word.
              BUT current design is Word -> Meaning. 
              Let's keep Word visible but maybe obscure it if we want "Test Mode"?
              User said "not only learn but also practice by typing to check". 
              This implies seeing the word and typing it (copying) OR seeing meaning and typing word.
              Given the "Flashcard" nature, usually you see front (Word) and think of meaning.
              OR see Front (Meaning) and think of Word.
              
              Let's assume for now we Type what we See to reinforce spelling, 
              OR we hide the word if it's "Test Mode".
              
              For now, let's keep the word visible but maybe allow typing to simple check spelling/reinforce.
              Wait, if word is visible, typing is just copying. 
              Maybe we should HIDE the word initially if we are in "Practice Mode"?
              
              Let's stick to the request: "enter keyword to next or submit word to check right/wrong".
              I will assume the word is visible for now (learning spelling), 
              OR I can blur it? 
              
              Let's just add the input field below.
           */}

          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              key={card.word + mode}
            >
              <h2 className="text-4xl font-bold text-white tracking-tight">
                {!isPractice ? card.word : card.meaning_vi}
              </h2>
            </motion.div>

            {/* Type Badge & Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide border",
                  card.type === "verb"
                    ? "text-red-400 border-red-900/30 bg-red-900/10"
                    : card.type === "noun"
                      ? "text-blue-400 border-blue-900/30 bg-blue-900/10"
                      : "text-slate-400 border-slate-800 bg-slate-800/50",
                )}
              >
                {card.type}
              </span>
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-[10px] text-slate-500 px-2 py-0.5 bg-slate-950 rounded border border-slate-800"
                >
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Input Area */}
          {isPractice && (
            <div className="w-full max-w-xs space-y-4">
              {/* Masked Word Hint */}
              {!isRevealed && (
                <div className="text-2xl font-mono tracking-[0.2em] text-slate-500 font-bold h-8">
                  {maskedWord}
                </div>
              )}

              <div className="relative group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => onInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!isRevealed) {
                        e.preventDefault();
                        e.stopPropagation();
                        onInputSubmit();
                      }
                    }
                  }}
                  placeholder="Type English word..."
                  readOnly={isRevealed || inputStatus === "given_up"}
                  className={cn(
                    "w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-center text-lg text-white placeholder:text-slate-600 focus:outline-hidden focus:ring-2 transition-all read-only:opacity-50 read-only:cursor-not-allowed",
                    inputStatus === "idle" &&
                      "focus:border-blue-500 focus:ring-blue-500/20",
                    (inputStatus === "correct" || inputStatus === "given_up") &&
                      "border-green-500 text-green-400 focus:border-green-500 focus:ring-green-500/20",
                    inputStatus === "incorrect" &&
                      "border-red-500 text-red-400 focus:border-red-500 focus:ring-red-500/20",
                  )}
                  autoFocus
                />

                {/* Hint Button */}
                {!isRevealed && (
                  <button
                    onClick={onHint}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-400 transition-colors p-1"
                    title="Get a hint"
                  >
                    <Lightbulb className="w-5 h-5" />
                  </button>
                )}

                <AnimatePresence>
                  {inputStatus === "correct" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute -right-8 top-1/2 -translate-y-1/2 text-green-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Practice Controls */}
              {!isRevealed && (
                <div className="flex justify-between items-center px-2">
                  <div className="h-6">
                    <AnimatePresence>
                      {inputStatus === "incorrect" && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-red-400 font-medium"
                        >
                          Try again!
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={onGiveUp}
                    className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors font-bold"
                  >
                    Bỏ cuộc (Hiện đáp án)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Revealed Content */}
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full pt-6 border-t border-slate-800/60 flex flex-col items-center gap-4"
              >
                {/* Meaning */}
                <div className="text-center">
                  <p className="text-xl font-black text-blue-300 tracking-tight">
                    {!isPractice ? card.meaning_vi : card.word}
                  </p>
                </div>

                {/* Sentences - Compact */}
                <div className="w-full text-left bg-slate-950/50 rounded-lg p-3 border border-slate-800/50 space-y-2">
                  <p className="text-sm text-slate-300">
                    <span className="text-slate-500 mr-2">Simple:</span>
                    {card.example_simple}
                  </p>
                  <div className="h-px bg-slate-800/50 w-full" />
                  <p className="text-sm text-slate-400 italic">
                    <span className="text-slate-600 not-italic mr-2">
                      Context:
                    </span>
                    {card.example_expand}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint when not revealed */}
          {!isRevealed && !isPractice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-8"
            >
              <p className="text-slate-600 text-xs uppercase tracking-widest font-medium animate-pulse">
                Tap to reveal
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
