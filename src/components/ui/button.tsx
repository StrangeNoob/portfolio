'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-accent-primary text-background hover:bg-accent-primary/90':
              variant === 'primary',
            'bg-surface text-foreground hover:bg-surface-hover':
              variant === 'secondary',
            'border border-border bg-transparent hover:bg-surface hover:border-border-hover':
              variant === 'outline',
            'bg-transparent hover:bg-surface': variant === 'ghost',
          },
          {
            'h-9 px-3 text-sm rounded-md': size === 'sm',
            'h-11 px-5 text-base rounded-lg': size === 'md',
            'h-14 px-8 text-lg rounded-xl': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
