import { cn } from '../../utils/helpers';
import { AlertCircle, ChevronDown } from 'lucide-react';

export default function Select({
  label,
  name,
  error,
  touched,
  options = [],
  placeholder = 'Selecciona una opción',
  required,
  className,
  ...props
}) {
  const hasError = touched && error;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={name} className="label-mono flex items-center gap-1.5">
          {label}
          {required && <span className="text-clay-400">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          className={cn(
            'w-full appearance-none px-4 py-2.5 pr-10 bg-cream-50 border rounded-lg text-ink-900',
            'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-cream-50',
            hasError
              ? 'border-red-400 focus:ring-red-200'
              : 'border-moss-100 focus:ring-moss-200 focus:border-moss-300'
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-moss-400 pointer-events-none"
        />
      </div>
      {hasError && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 mt-0.5 animate-fade-in">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}
