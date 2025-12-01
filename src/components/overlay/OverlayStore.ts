import { useSyncExternalStore } from 'react';
import { OverlayItem, OverlayOptions } from './type';

const SERVER_SNAPSHOT: OverlayItem[] = [];

class OverlayStore {
  private overlays: OverlayItem[] = [];
  private listeners: Set<() => void> = new Set();

  // 1. Subscribe (cần thiết cho useSyncExternalStore)
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  // 2. Get Snapshot (trả về dữ liệu hiện tại - immutable reference)
  getSnapshot = () => {
    return this.overlays;
  };

  getServerSnapshot = () => {
    return SERVER_SNAPSHOT
  };

  // 3. Actions
  open = (Component: React.ComponentType<any>, options: OverlayOptions = {}) => {
    const id = options.id || Math.random().toString(36).substring(7);
    if (this.overlays.find(o => o.id === id)) return;

    const overlay: OverlayItem = { id, Component, options };
    console.log(overlay)
    // Immutable update: tạo mảng mới để React nhận biết thay đổi
    this.overlays = [...this.overlays, overlay];
    this.notify();

    return id;
  };

  close = (id: string) => {
    this.overlays = this.overlays.filter((overlay) => overlay.id !== id);
    this.notify();
  };

  update = (id: string, newOptions: Partial<OverlayOptions>) => {
    this.overlays = this.overlays.map((overlay) => {
      if (overlay.id === id) {
        return {
          ...overlay,
          options: { ...overlay.options, ...newOptions },
        };
      }
      return overlay;
    });

    this.notify();
  };

  closeAll = () => {
    this.overlays = [];
    this.notify();
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const overlayStore = new OverlayStore();

export const useOverlayStore = () => useSyncExternalStore(overlayStore.subscribe, overlayStore.getSnapshot, overlayStore.getServerSnapshot);
