import { cn } from '../../utils/helpers';

export default function PageHeader({ eyebrow, title, description, actions, className }) {
  return (
    <div className={cn('flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8', className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="label-mono mb-2">{eyebrow}</p>}
        <h1 className="display-text text-3xl md:text-4xl text-moss-700 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-ink-500 leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
