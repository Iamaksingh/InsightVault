import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className={cn('relative z-10 w-full max-w-lg rounded-lg border p-4 shadow-xl', 'bg-white text-neutral-900 border-neutral-200', 'dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800')}>
        {children}
      </div>
    </div>,
    document.body
  );
}


