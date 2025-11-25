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
  const startTimeRef = useRef<number>(Date.now());

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
        'w-[350px] h-[100px] rounded-lg shadow-lg border px-4 py-1 text-lg flex items-center gap-3 cursor-pointer transition-transform hover:scale-105',
        toast.kind === 'success' && 'bg-green-50 border-green-200 text-green-800',
        toast.kind === 'error' && 'bg-red-50 border-red-200 text-red-800',
        toast.kind === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-800',
        toast.kind === 'info' && 'bg-blue-50 border-blue-200 text-blue-800',
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
