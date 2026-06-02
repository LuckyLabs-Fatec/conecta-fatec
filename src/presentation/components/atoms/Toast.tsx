"use client";
import React, { createContext, useCallback, useContext, useMemo, useState, useRef, useEffect } from 'react';

type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  kind?: ToastKind;
  durationMs?: number;
  error?: Error;
}

interface ToastItem extends Required<Omit<ToastOptions, 'error'>> {
  id: string;
  remainingTime: number;
  error?: Error;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const Toast: React.FC<{ toast: ToastItem; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(toast.remainingTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const elapsed = Date.now() - startTimeRef.current;
      setRemainingTime(prev => Math.max(0, prev - elapsed));
    } else {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onRemove(toast.id);
      }, remainingTime);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, remainingTime, toast.id, onRemove]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div
      key={toast.id}
      role="status"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={[
        'w-[350px] h-[100px] rounded-[30px] shadow-[var(--cps-shadow-1)] border px-4 py-1 text-lg flex items-center gap-3 cursor-pointer transition-transform hover:scale-105',
        toast.kind === 'success' && 'bg-[var(--cps-feedback-done-light)] border-[var(--cps-feedback-done-light)] text-[var(--cps-feedback-done)]',
        toast.kind === 'error' && 'bg-[var(--cps-feedback-cancelled-light)] border-[var(--cps-feedback-cancelled-light)] text-[var(--cps-feedback-cancelled)]',
        toast.kind === 'warning' && 'bg-[var(--cps-feedback-progress-light)] border-[var(--cps-feedback-progress-light)] text-[var(--cps-feedback-progress)]',
        toast.kind === 'info' && 'bg-[var(--cps-silver-base)] border-[var(--cps-gray-light)] text-[var(--cps-blue-base)]',
      ].filter(Boolean).join(' ')}
    >
      <span className="mt-0.5">{toast.kind === 'success' ? '✅' : toast.kind === 'error' ? '⚠️' : toast.kind === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span className="flex-1">
        <div>{toast.message}</div>
        {toast.error && (
          <div className="text-xs mt-1 opacity-80">
            {toast.error.message}
          </div>
        )}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        aria-label="Fechar"
        className="text-current/70 hover:text-current self-start mt-2"
      >
        ×
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2);
    const durationMs = options.durationMs ?? 3500;
    const item: ToastItem = {
      id,
      message: options.message,
      kind: options.kind ?? 'info',
      durationMs,
      remainingTime: durationMs,
      error: options.error,
    };
    setToasts((prev) => [...prev, item]);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
