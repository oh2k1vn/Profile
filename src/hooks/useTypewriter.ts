import { useState, useEffect } from 'react';

export function useTypewriter(fullText: string, speedMs = 45): string {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    const chars = Array.from(fullText);
    let index = 0;
    setTypedText('');

    const interval = setInterval(() => {
      if (index < chars.length) {
        setTypedText(chars.slice(0, index + 1).join(''));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [fullText, speedMs]);

  return typedText;
}
