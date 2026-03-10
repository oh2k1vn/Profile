import { createElement, useCallback } from "react";
import { useModal } from "@/hooks/use-modal";
import { ProfileSheet } from "@/components/sheets";

const PROFILE_SHEET_ID = "shared-profile-sheet";

/**
 * useProfileSheet — Shared hook để mở ProfileSheet từ bất kỳ đâu.
 *
 * SOLID:
 * - SRP: Hook chỉ lo logic open/close, không lo render.
 * - DIP: Page phụ thuộc vào hook (abstraction), không phụ thuộc trực tiếp vào component.
 *
 * Usage:
 *   const { openProfile } = useProfileSheet();
 *   openProfile({ name: "Minh", avatar: "...", phone: "0123..." });
 */
export const useProfileSheet = () => {
  const { openModal, closeModal } = useModal();

  const close = useCallback(() => closeModal(PROFILE_SHEET_ID), [closeModal]);

  const openProfile = useCallback(
    (data: { name: string; avatar: string; phone: string }) => {
      openModal({
        id: PROFILE_SHEET_ID,
        type: "bottom-sheet",
        content: createElement(ProfileSheet, {
          ...data,
          onClose: close,
        }),
        props: { title: data.name },
      });
    },
    [openModal, close],
  );

  return { openProfile, closeProfile: close };
};
