import {
  ref,
  onValue,
  onDisconnect,
  set,
  update,
  serverTimestamp,
} from 'firebase/database';
import { rtdb } from './firebase';

export interface OwnerPresenceState {
  isOnline: boolean;
  statusText: string;
  lastSeen: number | null;
}

// Generate or retrieve persistent Session ID for visitor tracking
function getSessionId(): string {
  let id = sessionStorage.getItem('v_session_id');
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    sessionStorage.setItem('v_session_id', id);
  }
  return id;
}

/**
 * Initializes visitor presence tracking via Firebase Realtime Database
 */
export function initVisitorPresence(onVisitorsChange: (count: number) => void): () => void {
  const sessionId = getSessionId();
  const connectedRef = ref(rtdb, '.info/connected');
  const sessionRef = ref(rtdb, `status/sessions/${sessionId}`);
  const allSessionsRef = ref(rtdb, 'status/sessions');

  const unsubscribeConnected = onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      // Set session on disconnect handler first
      onDisconnect(sessionRef)
        .remove()
        .catch((err) => console.warn('[Presence] onDisconnect remove error:', err));

      // Write session node
      set(sessionRef, {
        joinedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      }).catch((err) => console.warn('[Presence] set session error:', err));
    }
  });

  // Listen for count of active sessions
  const unsubscribeSessions = onValue(
    allSessionsRef,
    (snap) => {
      if (snap.exists()) {
        const val = snap.val();
        const count = Object.keys(val || {}).length;
        onVisitorsChange(count);
      } else {
        onVisitorsChange(1);
      }
    },
    (err) => {
      console.warn('[Presence] Listen sessions error:', err);
      onVisitorsChange(1);
    }
  );

  return () => {
    unsubscribeConnected();
    unsubscribeSessions();
  };
}

/**
 * Listens for Owner Presence (hiếu's online status & custom status message)
 */
export function listenOwnerPresence(
  onOwnerChange: (state: OwnerPresenceState) => void
): () => void {
  const ownerRef = ref(rtdb, 'status/owner');

  const unsubscribe = onValue(
    ownerRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        onOwnerChange({
          isOnline: Boolean(data.isOnline),
          statusText: data.statusText || 'Đang làm việc trên các sản phẩm công nghệ & UI',
          lastSeen: data.lastSeen || null,
        });
      } else {
        onOwnerChange({
          isOnline: true,
          statusText: 'Sẵn sàng nhận dự án & công việc mới',
          lastSeen: null,
        });
      }
    },
    (err) => {
      console.warn('[Presence] Listen owner error:', err);
      onOwnerChange({
        isOnline: true,
        statusText: 'Sẵn sàng nhận dự án & công việc mới',
        lastSeen: null,
      });
    }
  );

  return unsubscribe;
}

/**
 * Updates the Owner presence state when logged into Dashboard
 */
export function setOwnerOnline(statusText?: string): void {
  const ownerRef = ref(rtdb, 'status/owner');
  const connectedRef = ref(rtdb, '.info/connected');

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      onDisconnect(ownerRef)
        .update({
          isOnline: false,
          lastSeen: serverTimestamp(),
        })
        .catch(() => {});

      update(ownerRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
        ...(statusText ? { statusText } : {}),
      }).catch((err) => console.warn('[Presence] update owner error:', err));
    }
  });
}

/**
 * Updates owner's status message in Realtime Database
 */
export async function updateOwnerStatusText(statusText: string): Promise<void> {
  const ownerRef = ref(rtdb, 'status/owner');
  await update(ownerRef, {
    statusText: statusText.trim(),
    lastSeen: serverTimestamp(),
  });
}

/**
 * Tracks a logged in user's online presence in Realtime DB at `status/users/${uid}`
 */
export function trackUserPresence(uid: string): () => void {
  if (!uid) return () => {};

  const connectedRef = ref(rtdb, '.info/connected');
  const userPresenceRef = ref(rtdb, `status/users/${uid}`);

  const unsubscribe = onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      onDisconnect(userPresenceRef)
        .set({
          isOnline: false,
          lastActive: serverTimestamp(),
        })
        .catch(() => {});

      set(userPresenceRef, {
        isOnline: true,
        lastActive: serverTimestamp(),
      }).catch((err) => console.warn('[Presence] User presence set error:', err));
    }
  });

  return unsubscribe;
}

/**
 * Listens for all user online statuses from `status/users` node
 */
export function listenUsersPresence(
  onUsersChange: (onlineMap: Record<string, boolean>) => void
): () => void {
  const usersRef = ref(rtdb, 'status/users');

  const unsubscribe = onValue(
    usersRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const onlineMap: Record<string, boolean> = {};
        Object.keys(data).forEach((uid) => {
          if (data[uid] && data[uid].isOnline) {
            onlineMap[uid] = true;
          }
        });
        onUsersChange(onlineMap);
      } else {
        onUsersChange({});
      }
    },
    () => {
      onUsersChange({});
    }
  );

  return unsubscribe;
}
