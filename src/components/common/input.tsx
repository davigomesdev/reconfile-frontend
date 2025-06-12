import React from 'react';
import { cn } from '@/utils/cn.util';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-950 ring-offset-green-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-200 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export default Input;
