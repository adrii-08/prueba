import { cn } from '../../utils/helpers';
import { AlertCircle } from 'lucide-react';

export default function Input({
  label,
  name,
  error,
  touched,
  hint,
  className,
  required,
  type = 'text',
  ...props
}) {
  const hasError = touched && error;

  const baseInput =
    'w-full px-4 py-2.5 bg-cream-50 border rounded-lg text-ink-900 placeholder:text-ink-400 ' +
    'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-cream-50';

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={name} className="label-mono flex items-center gap-1.5">
          {label}
          {required && <span className="text-clay-400">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          className={cn(
            baseInput,
            'resize-none',
            hasError
              ? 'border-red-400 focus:ring-red-200'
              : 'border-moss-100 focus:ring-moss-200 focus:border-moss-300'
          )}
          {...props}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={cn(
            baseInput,
            hasError
              ? 'border-red-400 focus:ring-red-200'
              : 'border-moss-100 focus:ring-moss-200 focus:border-moss-300'
          )}
          {...props}
        />
      )}

      {hasError ? (
        <p className="flex items-center gap-1.5 text-xs text-red-600 mt-0.5 animate-fade-in">
          <AlertCircle size={12} />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-500 mt-0.5">{hint}</p>
      ) : null}
    </div>
  );
}
