import { cn } from '../../utils/helpers';

const variants = {
  default: 'bg-moss-50 text-moss-600 border-moss-100',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  clay: 'bg-clay-100 text-clay-500 border-clay-200',
  ink: 'bg-ink-900 text-cream-50 border-ink-900',
};

export default function Badge({ children, variant = 'default', className, dot }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full border',
        'tracking-wide',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-emerald-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'default' && 'bg-moss-400',
            variant === 'clay' && 'bg-clay-400',
            variant === 'ink' && 'bg-cream-50'
          )}
        />
      )}
      {children}
    </span>
  );
}
