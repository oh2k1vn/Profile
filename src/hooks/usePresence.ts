import { useState, useEffect, useCallback } from 'react';
import {
  initVisitorPresence,
  listenOwnerPresence,
  listenUsersPresence,
  updateOwnerStatusText,
  type OwnerPresenceState,
} from '../services/presenceService';

export function usePresence() {
  const [activeVisitors, setActiveVisitors] = useState<number>(1);
  const [ownerStatus, setOwnerStatus] = useState<OwnerPresenceState>({
    isOnline: true,
    statusText: 'Sẵn sàng nhận dự án & công việc mới',
    lastSeen: null,
  });
  const [onlineUsersMap, setOnlineUsersMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubVisitor = initVisitorPresence((count) => {
      setActiveVisitors(count > 0 ? count : 1);
    });

    const unsubOwner = listenOwnerPresence((state) => {
      setOwnerStatus(state);
    });

    const unsubUsers = listenUsersPresence((onlineMap) => {
      setOnlineUsersMap(onlineMap);
    });

    return () => {
      unsubVisitor();
      unsubOwner();
      unsubUsers();
    };
  }, []);

  const updateStatusText = useCallback(async (newStatusText: string) => {
    await updateOwnerStatusText(newStatusText);
  }, []);

  return {
    activeVisitors,
    ownerStatus,
    onlineUsersMap,
    updateStatusText,
  };
}
