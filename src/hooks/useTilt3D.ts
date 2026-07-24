import { useState, useRef, type CSSProperties, type MouseEvent } from 'react';

interface Tilt3DReturn {
  cardRef: React.RefObject<HTMLDivElement | null>;
  tiltStyle: CSSProperties;
  handleMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
}

export function useTilt3D(maxAngle = 10): Tilt3DReturn {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease-out',
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * maxAngle;
    const rotateX = -((y - centerY) / centerY) * maxAngle;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.05s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  };

  return { cardRef, tiltStyle, handleMouseMove, handleMouseLeave };
}
