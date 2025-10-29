"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  kind?: ToastKind;
  durationMs?: number;
}

interface ToastItem extends Required<ToastOptions> { id: string }

interface ToastContextValue {
  show: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2);
    const item: ToastItem = {
      id,
      message: options.message,
      kind: options.kind ?? 'info',
      durationMs: options.durationMs ?? 3500,
    };
    setToasts((prev) => [...prev, item]);
    window.setTimeout(() => remove(id), item.durationMs);
  }, [remove]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              'min-w-[260px] max-w-sm rounded-lg shadow-lg border px-4 py-3 text-sm flex items-start gap-3',
              t.kind === 'success' && 'bg-green-50 border-green-200 text-green-800',
              t.kind === 'error' && 'bg-red-50 border-red-200 text-red-800',
              t.kind === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-800',
              t.kind === 'info' && 'bg-blue-50 border-blue-200 text-blue-800',
            ].filter(Boolean).join(' ')}
          >
            <span className="mt-0.5">{t.kind === 'success' ? '✅' : t.kind === 'error' ? '⚠️' : t.kind === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              aria-label="Fechar"
              className="text-current/70 hover:text-current"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
