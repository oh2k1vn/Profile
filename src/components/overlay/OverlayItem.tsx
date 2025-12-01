import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { overlayStore } from './OverlayStore';
import { DialogWrapper } from './wrappers/DialogWrapper';
import { DrawerWrapper } from './wrappers/DrawerWrapper';
import { SheetWrapper } from './wrappers/SheetWrapper';

const WRAPPERS = {
  dialog: DialogWrapper,
  sheet: SheetWrapper,
  drawer: DrawerWrapper,
};

const BASE_Z_INDEX = 50;

const OverlayItem = ({ overlay, index }: { overlay: any; index: number }) => {
  const { Component, options, id } = overlay;
  const { type = 'dialog', containerId } = options;

  // State để lưu target element (giải quyết vấn đề Timing)
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  // useLayoutEffect giúp tìm DOM ngay sau khi Browser paint xong frame trước đó
  useLayoutEffect(() => {
    if (containerId) {
      const el = document.getElementById(containerId);
      if (el) {
        setMountNode(el);
      } else {
        // Log cảnh báo nếu chờ mãi không thấy ID đâu (debug cực tiện)
        console.warn(
          `[OverlayRender] Không tìm thấy containerId: "${containerId}" cho overlay "${id}"`
        );
      }
    } else {
      setMountNode(document.body);
    }
  }, [containerId, id]);

  if (!mountNode) return null; // Chưa có node thì chưa render

  const Wrapper = WRAPPERS[type as keyof typeof WRAPPERS] ?? DialogWrapper;
  const zIndex = BASE_Z_INDEX + index * 10;
  const isNested = !!containerId;

  // Render Portal
  return createPortal(
    <Wrapper zIndex={zIndex} isNested={isNested} onClose={() => overlayStore.close(id)}>
      <Component id={id} close={() => overlayStore.close(id)} {...options} />
    </Wrapper>,
    mountNode
  );
};

export default OverlayItem;
