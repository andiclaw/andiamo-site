import { STATUS_COLOR, STATUS_LABEL, type ProductStatus } from '@/lib/products';

export function StatusBadge({ status, className = '' }: { status: ProductStatus; className?: string }) {
  const color = STATUS_COLOR[status];
  const label = STATUS_LABEL[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill text-[10px] font-semibold uppercase tracking-widest ${className}`}
      style={{ color, background: `${color}14`, border: `1px solid ${color}33` }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: status === 'live' ? `0 0 8px ${color}` : 'none' }} />
      {label}
    </span>
  );
}
