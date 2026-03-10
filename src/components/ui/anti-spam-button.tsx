import React from "react";
import { Button as ZUIButton } from "zmp-ui";
import { motion, AnimatePresence } from "framer-motion";
import { useAntiSpam, AntiSpamOptions } from "@/hooks/use-anti-spam";
import { cn } from "@/utils/cn";

// Sub-component: Handle Animation (SOLID: Single Responsibility)
const PenaltyProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <AnimatePresence>
    {progress > 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute bottom-0 left-0 h-1 bg-blue-500 z-50 rounded-full"
        style={{ width: `${progress}%` }}
      />
    )}
  </AnimatePresence>
);

interface AntiSpamButtonProps extends AntiSpamOptions {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
  /** If true, renders a clean wrapper without ZUIButton styles (perfect for Cards) */
  isPlain?: boolean;
  /** Whether to show the cooldown text inside the button */
  showCooldownText?: boolean;
}

/**
 * Premium Anti-Spam Component (SOLID Refactored)
 */
export const AntiSpamButton: React.FC<AntiSpamButtonProps> = ({
  children,
  onClick,
  className,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  size = "medium",
  icon,
  isPlain = false,
  showCooldownText = true,
  ...spamOptions
}) => {
  const {
    handleClick,
    isLoading,
    isCooldown,
    cooldownRemaining,
    penaltyDuration,
  } = useAntiSpam(onClick, spamOptions);

  const renderContent = () => {
    if (isPlain) {
      return (
        <div className={cn("relative cursor-pointer select-none", className)}>
          {children}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-inherit backdrop-blur-[1px] transition-all">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent animate-spin rounded-full shadow-lg" />
            </div>
          )}
        </div>
      );
    }

    const buttonType =
      variant === "primary"
        ? "highlight"
        : variant === "danger"
          ? "danger"
          : "neutral";

    return (
      <ZUIButton
        type={buttonType}
        disabled={disabled || isCooldown}
        loading={isLoading}
        onClick={handleClick as any}
        fullWidth={fullWidth}
        size={size}
        className={cn(
          "transition-all duration-200 active:opacity-80",
          isCooldown && "grayscale opacity-70 pointer-events-none",
          className,
        )}
        icon={icon}
      >
        {isCooldown && showCooldownText ? (
          <span className="flex items-center gap-2">
            Thử lại sau (
            {Math.ceil(
              (cooldownRemaining * (penaltyDuration ?? 2000)) / 100000,
            )}
            s)
          </span>
        ) : (
          children
        )}
      </ZUIButton>
    );
  };

  return (
    <div className={cn("relative", fullWidth ? "w-full" : "w-fit")}>
      <motion.div
        whileTap={!disabled && !isLoading && !isCooldown ? { scale: 0.98 } : {}}
        onClick={
          isPlain
            ? (e) => {
                e.stopPropagation();
                handleClick(e);
              }
            : undefined
        }
        className={cn(fullWidth ? "w-full" : "w-fit", "rounded-inherit")}
      >
        {renderContent()}
      </motion.div>

      <PenaltyProgressBar progress={cooldownRemaining} />
    </div>
  );
};

export default AntiSpamButton;
