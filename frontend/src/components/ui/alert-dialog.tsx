import { createPortal } from 'react-dom';

export function AlertDialog({ open, onConfirm, onCancel, title, description }: { open: boolean; onConfirm: () => void; onCancel: () => void; title: string; description?: string }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-lg border p-4 shadow-xl bg-white text-neutral-900 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{description}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-md border px-3 py-1.5 text-sm border-neutral-200 dark:border-neutral-700" onClick={onCancel}>Cancel</button>
          <button className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>,
    document.body
  );
}


