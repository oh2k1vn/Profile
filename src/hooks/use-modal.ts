import { modalStackAtom, ModalType } from "@/stores/modal-store";
import { useSetAtom } from "jotai";
import { ReactNode, useCallback } from "react";

/**
 * useModal is now strictly for ACTIONS.
 * It does not return the current stack, preventing unnecessary re-renders
 * in components that only trigger modal actions.
 */
export const useModal = () => {
  const setModalStack = useSetAtom(modalStackAtom);

  const openModal = useCallback(
    ({
      type,
      content,
      props = {},
      replace = false,
      id: customId,
    }: {
      type: ModalType;
      content: ReactNode;
      props?: any;
      replace?: boolean;
      id?: string;
    }) => {
      const id = customId || Math.random().toString(36).substring(2, 9);

      setModalStack((stack) => {
        // IDEMPOTENCY GUARD: If modal with this ID already exists, do NOTHING.
        // This is CRITICAL to prevent animation glitches when the user spams the open trigger.
        // Updates should be handled by `updateModal` or the hook's internal state.
        if (stack.some((m) => m.id === id)) {
          return stack;
        }

        const newInstance = { id, type, content, props };
        if (replace && stack.length > 0) {
          return [...stack.slice(0, -1), newInstance];
        }
        return [...stack, newInstance];
      });
      return id;
    },
    [setModalStack],
  );

  const updateModal = useCallback(
    (id: string, config: { content?: ReactNode; props?: any }) => {
      setModalStack((stack) =>
        stack.map((m) =>
          m.id === id
            ? {
                ...m,
                content: config.content ?? m.content,
                props: { ...m.props, ...config.props },
              }
            : m,
        ),
      );
    },
    [setModalStack],
  );

  const closeModal = useCallback(
    (id?: string) => {
      setModalStack((stack) => {
        if (id) {
          return stack.filter((m) => m.id !== id);
        }
        return stack.slice(0, -1);
      });
    },
    [setModalStack],
  );

  const closeAllModals = useCallback(() => {
    setModalStack([]);
  }, [setModalStack]);

  return {
    openModal,
    updateModal,
    closeModal,
    closeAllModals,
  };
};
