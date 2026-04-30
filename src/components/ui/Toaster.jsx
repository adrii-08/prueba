import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils/helpers';

const config = {
  success: { Icon: CheckCircle2, color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  error: { Icon: AlertTriangle, color: 'border-red-300 bg-red-50 text-red-800' },
  info: { Icon: Info, color: 'border-blue-300 bg-blue-50 text-blue-800' },
};

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => {
        const { Icon, color } = config[t.type] || config.info;
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 px-4 py-3 rounded-lg border shadow-card animate-slide-up',
              color
            )}
          >
            <Icon size={18} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-current opacity-50 hover:opacity-100"
              aria-label="Cerrar"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
