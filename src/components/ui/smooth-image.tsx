import React, { useState, useEffect } from "react";
import { HTMLMotionProps, motion, AnimatePresence } from "framer-motion";
import { ImageOff } from "lucide-react";
import { cn } from "@/utils/cn";

type ImageProps = Omit<
  HTMLMotionProps<"img">,
  "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
>;

interface SmoothImageProps extends ImageProps {
  fallbackSrc?: string;
  wrapperClassName?: string;
}

export const SmoothImage: React.FC<SmoothImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=60&w=400", // A generic high-quality abstract fallback
  wrapperClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(true); // Stop showing skeleton
    setCurrentSrc(fallbackSrc);
  };

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {/* Skeleton / Shimmer Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10 bg-gray-200"
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State Placeholder */}
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 bg-gray-100 flex flex-col items-center justify-center p-4 text-center gap-2"
          >
            <ImageOff className="text-gray-300" size={32} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              Không thể tải ảnh
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        {...props}
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.05,
          filter: isLoaded ? "blur(0px)" : "blur(10px)",
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn("w-full h-full object-cover", className)}
      />

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
