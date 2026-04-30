import { Inbox, AlertTriangle } from 'lucide-react';
import Button from './Button';

export function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <div
      className={`inline-block border-2 border-moss-300 border-t-transparent rounded-full animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function LoadingState({ message = 'Cargando…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <LoadingSpinner size={32} />
      <p className="label-mono">{message}</p>
    </div>
  );
}

// Skeleton de filas para tablas
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2 animate-pulse-soft">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-moss-100">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-3 bg-moss-100 rounded flex-1"
              style={{ maxWidth: j === 0 ? '40%' : '100%' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-cream-100 border border-moss-100 rounded-xl p-6 animate-pulse-soft h-48"
        />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-cream-100 border border-moss-100 flex items-center justify-center mb-4">
        <Icon className="text-moss-300" size={22} />
      </div>
      <h3 className="display-text text-xl text-moss-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-500 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = 'Algo salió mal', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4">
        <AlertTriangle className="text-red-500" size={22} />
      </div>
      <h3 className="display-text text-xl text-moss-700 mb-1">No pudimos cargar la información</h3>
      <p className="text-sm text-ink-500 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-5">
          Reintentar
        </Button>
      )}
    </div>
  );
}
