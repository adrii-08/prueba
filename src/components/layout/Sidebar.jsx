import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  MapPin,
  Sparkles,
  Plus,
} from 'lucide-react';
import { cn } from '../../utils/helpers';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/events', label: 'Eventos', icon: CalendarDays },
  { to: '/attendees', label: 'Asistentes', icon: Users },
  { to: '/venues', label: 'Sedes', icon: MapPin },
  { to: '/sponsors', label: 'Patrocinadores', icon: Sparkles },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-moss-700 text-cream-100 fixed inset-y-0 left-0 z-30">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-moss-600/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-cream-50 text-moss-700 flex items-center justify-center font-display font-bold text-lg">
            A
          </div>
          <div>
            <h1 className="display-text text-xl font-semibold leading-tight">Atelier</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-moss-100/60">
              Event Studio
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="label-mono text-moss-100/40 px-3 mb-2">Navegación</p>
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                    isActive
                      ? 'bg-cream-50 text-moss-700 font-medium shadow-sm'
                      : 'text-cream-100/80 hover:bg-moss-600/50 hover:text-cream-50'
                  )
                }
              >
                <Icon size={17} strokeWidth={1.8} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-8 mx-2 p-4 rounded-xl bg-moss-600/40 border border-moss-500/40">
          <p className="text-xs text-cream-100/70 mb-2 leading-relaxed">
            Crea un nuevo evento desde cero en menos de un minuto.
          </p>
          <NavLink
            to="/events/new"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-md bg-cream-50 text-moss-700 text-xs font-medium hover:bg-cream-100 transition-colors"
          >
            <Plus size={14} />
            Nuevo evento
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-moss-600/40 text-xs text-cream-100/50">
        <p className="font-mono">v1.0.0 · 2026</p>
      </div>
    </aside>
  );
}
