import { Search, Bell, Menu } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const today = new Intl.DateTimeFormat('es-PY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 bg-cream-50/80 backdrop-blur-md border-b border-moss-100">
      <div className="flex items-center justify-between px-6 lg:px-10 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-md text-moss-700 hover:bg-cream-100"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:block">
            <p className="label-mono">Hoy</p>
            <p className="text-sm text-ink-700 capitalize -mt-0.5">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-moss-300"
            />
            <input
              type="search"
              placeholder="Buscar…"
              className="w-64 pl-9 pr-4 py-2 text-sm bg-cream-100 border border-moss-100 rounded-lg
                         placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-moss-200
                         focus:bg-cream-50 transition-all"
            />
          </div>

          {/* Notif */}
          <button
            className="relative p-2 rounded-lg text-moss-600 hover:bg-cream-100 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell size={18} strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-clay-400 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-moss-100">
            <div className="w-9 h-9 rounded-full bg-clay-300 text-cream-50 flex items-center justify-center font-display font-semibold text-sm">
              E
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-ink-900 leading-tight">Ever</p>
              <p className="text-[11px] text-ink-500 leading-tight">Coordinador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
