import { cn } from '../../utils/helpers';

export default function Card({ children, className, hoverable, padding = 'md', ...props }) {
  const padding_classes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-cream-50 border border-moss-100 rounded-xl shadow-card transition-all duration-300',
        hoverable && 'hover:shadow-card-hover hover:-translate-y-0.5 hover:border-moss-200 cursor-pointer',
        padding_classes[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
