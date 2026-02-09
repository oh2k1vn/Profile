import { useState, useCallback } from "react";

const PIN_KEY = "trader_access";
const CORRECT_PIN = "160600";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${PIN_KEY}=`));
    return !!cookie;
  });

  const login = useCallback((pin: string) => {
    if (pin === CORRECT_PIN) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 2); // 2 days
      document.cookie = `${PIN_KEY}=true; expires=${expires.toUTCString()}; path=/`;
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    document.cookie = `${PIN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
