import { cn } from '../../utils/helpers';

const variants = {
  primary:
    'bg-moss-600 text-cream-50 hover:bg-moss-700 active:bg-moss-800 shadow-sm',
  secondary:
    'bg-cream-100 text-moss-700 hover:bg-cream-200 border border-moss-100',
  outline:
    'bg-transparent text-moss-600 border border-moss-300 hover:bg-moss-50',
  ghost: 'bg-transparent text-moss-600 hover:bg-moss-50',
  danger: 'bg-red-700 text-cream-50 hover:bg-red-800',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  loading,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-moss-300 focus:ring-offset-2 focus:ring-offset-cream-50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
