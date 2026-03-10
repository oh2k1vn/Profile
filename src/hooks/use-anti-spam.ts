import { useState, useRef, useCallback, useEffect } from "react";

export interface AntiSpamOptions {
  /** Minimum interval between clicks (100ms = 10 clicks/sec) */
  minClickInterval?: number;
  /** Maximum number of rapid clicks allowed before penalty */
  maxRapidClicks?: number;
  /** Cooldown duration in milliseconds after detecting too many fast clicks */
  penaltyDuration?: number;
}

/**
 * useAntiSpam Hook (SOLID: Single Responsibility Principle)
 * Handles timing, rate-limiting, and async state management.
 */
export const useAntiSpam = <T = any>(
  onClick?: (event: T) => void | Promise<void>,
  options: AntiSpamOptions = {},
) => {
  const {
    minClickInterval = 100,
    maxRapidClicks = 8,
    penaltyDuration = 2000,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const lastClickRef = useRef<number>(0);
  const rapidClickCountRef = useRef<number>(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  const triggerPenalty = useCallback(() => {
    setIsCooldown(true);
    setCooldownRemaining(100);
    rapidClickCountRef.current = 0;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / penaltyDuration) * 100);
      setCooldownRemaining(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 50);

    cooldownTimerRef.current = setTimeout(() => {
      setIsCooldown(false);
      setCooldownRemaining(0);
      clearInterval(interval);
    }, penaltyDuration);
  }, [penaltyDuration]);

  const wrapClick = async (e: any) => {
    if (isLoading || isCooldown) return;

    const now = Date.now();
    const timeSinceLastClick = now - lastClickRef.current;

    // Rate limiting check
    if (timeSinceLastClick < minClickInterval) {
      rapidClickCountRef.current += 1;
      if (rapidClickCountRef.current >= maxRapidClicks) {
        triggerPenalty();
      }
      return;
    }

    // Reset rapid counter
    if (timeSinceLastClick > 500) {
      rapidClickCountRef.current = 0;
    }

    lastClickRef.current = now;

    if (onClick) {
      const result = onClick(e);
      if (result instanceof Promise) {
        setIsLoading(true);
        try {
          await result;
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return {
    handleClick: wrapClick,
    isLoading,
    isCooldown,
    cooldownRemaining,
    penaltyDuration,
  };
};
