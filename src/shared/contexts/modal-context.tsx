"use client";

import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { ModalId, ModalConfig, ModalContextValue, ModalOptions, ModalProps } from "../types/modal";
import { cn } from "../lib/utils";

class ModalManager {
  private modals: Map<ModalId, ModalConfig> = new Map();
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  openModal<T = unknown>(
    id: ModalId,
    component: React.ComponentType<ModalProps<T>>,
    props?: T,
    options?: ModalOptions
  ) {
    this.modals.set(id, {
      id,
      component: component as React.ComponentType<ModalProps<unknown>>,
      props,
      options: {
        closeOnOverlayClick: true,
        closeOnEscape: true,
        showCloseButton: true,
        size: "md",
        position: "center",
        ...options,
      },
    });
    this.notify();

    if (options?.onOpen) {
      setTimeout(() => {
        options.onOpen?.();
      }, 0);
    }
  }

  closeModal(id: ModalId) {
    const modal = this.modals.get(id);
    if (modal?.options?.onClose) {
      modal.options.onClose();
    }
    this.modals.delete(id);
    this.notify();
  }

  closeAllModals() {
    this.modals.forEach((modal) => {
      if (modal.options?.onClose) {
        modal.options.onClose();
      }
    });
    this.modals.clear();
    this.notify();
  }

  isModalOpen(id: ModalId): boolean {
    return this.modals.has(id);
  }

  getModalData<T = unknown>(id: ModalId): T | undefined {
    const modal = this.modals.get(id);
    return modal?.props as T | undefined;
  }

  getModals(): Map<ModalId, ModalConfig> {
    return new Map(this.modals);
  }
}

const modalManager = new ModalManager();

const MODAL_ROOT_ID = "modal-root";

function getModalRoot(): HTMLElement {
  if (typeof document === "undefined") return null as unknown as HTMLElement;
  let root = document.getElementById(MODAL_ROOT_ID);
  if (!root) {
    root = document.createElement("div");
    root.id = MODAL_ROOT_ID;
    document.body.appendChild(root);
  }
  return root;
}

function ModalRoot() {
  const [modals, setModals] = useState<Map<ModalId, ModalConfig>>(new Map());
  const [mounted, setMounted] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setPortalTarget(getModalRoot());
    const unsubscribe = modalManager.subscribe(() => {
      setModals(modalManager.getModals());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const openModals = Array.from(modals.values());
        const lastModal = openModals[openModals.length - 1];
        if (lastModal?.options?.closeOnEscape !== false) {
          modalManager.closeModal(lastModal.id);
        }
      }
    };

    if (modals.size > 0) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [modals]);

  useEffect(() => {
    if (modals.size > 0) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [modals.size]);

  if (!mounted || !portalTarget) return null;

  const modalsArray = Array.from(modals.values());

  return createPortal(
    <>
      {modalsArray.map((modal, index) => (
        <ModalWrapper 
          key={String(modal.id)} 
          modal={modal} 
          closeModal={modalManager.closeModal.bind(modalManager)}
          zIndex={50 + (index * 10)}
        />
      ))}
    </>,
    portalTarget
  );
}

function ModalWrapper({
  modal,
  closeModal,
  zIndex = 50,
}: {
  modal: ModalConfig;
  closeModal: (id: ModalId) => void;
  zIndex?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      closeModal(modal.id);
    }, 300);
  }, [modal.id, closeModal]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && modal.options?.closeOnOverlayClick !== false) {
        handleClose();
      }
    },
    [handleClose, modal.options]
  );

  const position = modal.options?.position || "center";
  const size = modal.options?.size || "md";

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  const sideSizeClasses = {
    sm: position === "left" || position === "right" ? "w-80" : "h-80",
    md: position === "left" || position === "right" ? "w-96" : "h-96",
    lg: position === "left" || position === "right" ? "w-[32rem]" : "h-[32rem]",
    xl: position === "left" || position === "right" ? "w-[40rem]" : "h-[40rem]",
    full: position === "left" || position === "right" ? "w-full" : "h-full",
  };

  const ModalComponent = modal.component;

  if (position === "left" || position === "right") {
    return (
      <div
        className={cn(
          "fixed inset-0 transition-opacity duration-300",
          isVisible && !isAnimating ? "opacity-100" : "opacity-0",
          "bg-black/50 backdrop-blur-sm",
          modal.options?.overlayClassName
        )}
        style={{ zIndex }}
        onClick={handleOverlayClick}
      >
        <div
          className={cn(
            "fixed top-0 bottom-0",
            position === "left" ? "left-0" : "right-0",
            sideSizeClasses[size],
            "transform bg-card shadow-2xl transition-transform duration-300 rounded-lg",
            isVisible && !isAnimating
              ? "translate-x-0"
              : position === "left"
              ? "-translate-x-full"
              : "translate-x-full",
            modal.options?.className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {modal.options?.showCloseButton !== false && (
            <button
              onClick={handleClose}
              className={cn(
                "absolute right-4 top-4 z-10 rounded-full p-2",
                "text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "fill-white"
              )}
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5 fill-white" />
            </button>
          )}

          <ModalComponent
            isOpen={isVisible && !isAnimating}
            onClose={handleClose}
            data={modal.props}
          />
        </div>
      </div>
    );
  }

  if (position === "top" || position === "bottom") {
    return (
      <div
        className={cn(
          "fixed inset-0 transition-opacity duration-300",
          isVisible && !isAnimating ? "opacity-100" : "opacity-0",
          "bg-black/50 backdrop-blur-sm",
          modal.options?.overlayClassName
        )}
        style={{ zIndex }}
        onClick={handleOverlayClick}
      >
        <div
          className={cn(
            "fixed left-0 right-0",
            position === "top" ? "top-0" : "bottom-0",
            sideSizeClasses[size],
            "transform bg-card shadow-2xl transition-transform duration-300 rounded-lg",
            isVisible && !isAnimating
              ? "translate-y-0"
              : position === "top"
              ? "-translate-y-full"
              : "translate-y-full",
            modal.options?.className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {modal.options?.showCloseButton !== false && (
            <button
              onClick={handleClose}
              className={cn(
                "absolute right-4 top-4 z-10 rounded-full p-2",
                "text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5 fill-white" />
            </button>
          )}

          <ModalComponent
            isOpen={isVisible && !isAnimating}
            onClose={handleClose}
            data={modal.props}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-300",
        isVisible && !isAnimating ? "opacity-100" : "opacity-0",
        "bg-black/50 backdrop-blur-sm",
        modal.options?.overlayClassName
      )}
      style={{ zIndex }}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          "relative w-full",
          sizeClasses[size],
          "transform rounded-lg bg-card shadow-xl transition-all duration-300",
          isVisible && !isAnimating
            ? "scale-100 translate-y-0"
            : "scale-95 translate-y-4",
          modal.options?.className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {modal.options?.showCloseButton !== false && (
          <button
            onClick={handleClose}
            className={cn(
              "absolute right-4 top-4 z-10 rounded-full p-2",
              "text-muted-foreground transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5 fill-white" />
          </button>
        )}

        <ModalComponent
          isOpen={isVisible && !isAnimating}
          onClose={handleClose}
          data={modal.props}
        />
      </div>
    </div>
  );
}

export function useModal(): ModalContextValue {
  const openModal = useCallback(
    <T = unknown>(
      id: ModalId,
      component: React.ComponentType<ModalProps<T>>,
      props?: T,
      options?: ModalOptions
    ) => {
      modalManager.openModal(id, component, props, options);
    },
    []
  );

  const closeModal = useCallback((id: ModalId) => {
    modalManager.closeModal(id);
  }, []);

  const closeAllModals = useCallback(() => {
    modalManager.closeAllModals();
  }, []);

  const isModalOpen = useCallback(
    (id: ModalId) => {
      return modalManager.isModalOpen(id);
    },
    []
  );

  const getModalData = useCallback(
    <T = unknown,>(id: ModalId): T | undefined => {
      return modalManager.getModalData<T>(id);
    },
    []
  );

  return {
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    getModalData,
  };
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ModalRoot />
    </>
  );
}
