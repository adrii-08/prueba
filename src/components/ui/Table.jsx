import { cn } from '../../utils/helpers';

export function Table({ children, className }) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-moss-100 bg-cream-50', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="bg-cream-100 border-b border-moss-100">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, className }) {
  return (
    <th
      className={cn(
        'px-5 py-3.5 text-left label-mono text-moss-500',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-moss-100">{children}</tbody>;
}

export function Tr({ children, className, onClick, hoverable }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors',
        hoverable && 'hover:bg-cream-100 cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className }) {
  return (
    <td className={cn('px-5 py-4 text-ink-800', className)}>{children}</td>
  );
}
