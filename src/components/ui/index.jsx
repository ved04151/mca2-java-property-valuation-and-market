import React from 'react';
import { cn } from '../../utils/formatters';

export const Button = React.forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants = {
      default:
        'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 shadow-md shadow-blue-900/30',
      secondary:
        'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/60',
      outline:
        'border border-slate-700 bg-transparent hover:bg-slate-800/80 hover:text-white text-slate-200',
      ghost:
        'hover:bg-slate-800/60 text-slate-300 hover:text-white',
      destructive:
        'bg-rose-600/90 text-white hover:bg-rose-500 active:bg-rose-700 shadow-sm shadow-rose-950/40',
      subtle:
        'bg-blue-950/40 text-blue-400 hover:bg-blue-900/60 border border-blue-800/40',
    };

    const sizes = {
      default: 'h-10 px-4 py-2 rounded-lg text-sm',
      sm: 'h-8 px-3 rounded-md text-xs',
      lg: 'h-12 px-6 rounded-xl text-base',
      icon: 'h-10 w-10 rounded-lg p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      'rounded-xl border border-slate-800/80 bg-[#0e1626]/90 text-slate-100 shadow-lg shadow-black/20 backdrop-blur-sm',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className, children, ...props }) => (
  <div
    className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={cn('text-lg font-semibold tracking-tight text-white', className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-slate-400', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-5 pt-2', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div
    className={cn('flex items-center p-5 pt-0 border-t border-slate-800/60 mt-4', className)}
    {...props}
  >
    {children}
  </div>
);

export const Badge = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const badgeVariants = {
    default: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    destructive: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    outline: 'border-slate-700 text-slate-300',
    secondary: 'bg-slate-800 text-slate-400 border-slate-700/50',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Input = React.forwardRef(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-slate-700/80 bg-[#090f1d] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            error && 'border-rose-500 focus-visible:ring-rose-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const Label = ({ className, children, required, ...props }) => (
  <label
    className={cn(
      'text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 block',
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-rose-400 ml-1">*</span>}
  </label>
);

export const Skeleton = ({ className, ...props }) => (
  <div
    className={cn('animate-pulse rounded-md bg-slate-800/80', className)}
    {...props}
  />
);
