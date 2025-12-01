import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useOverlayStore } from './OverlayStore';

import OverlayItem from './OverlayItem';

export const OverlayRender = () => {
  const overlays = useOverlayStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return (
    <AnimatePresence mode="popLayout">
      {overlays.map((overlay, index) => (
        <OverlayItem key={overlay.id} overlay={overlay} index={index} />
      ))}
    </AnimatePresence>
  );
};
