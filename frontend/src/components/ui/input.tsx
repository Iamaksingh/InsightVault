import * as React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-9 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]',
          'bg-white text-neutral-900 border-neutral-200 placeholder:text-neutral-500',
          'dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800 dark:placeholder:text-neutral-400',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';


