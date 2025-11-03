import * as React from 'react';
import { createPortal } from 'react-dom';

type Toast = { id: number; title: string; description?: string };

const ToastContext = React.createContext<{
  add: (t: Omit<Toast, 'id'>) => void;
} | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const add = React.useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-2 z-[100] flex justify-center">
          <div className="flex w-full max-w-md flex-col gap-2 px-2">
            {toasts.map((t) => (
              <div key={t.id} className="pointer-events-auto rounded-md border bg-white p-3 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="font-medium">{t.title}</div>
                {t.description ? <div className="text-neutral-600 dark:text-neutral-300">{t.description}</div> : null}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}


