import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Plus, Search, CalendarDays, Users, MapPin, Edit3, Trash2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { CardSkeleton, EmptyState, ErrorState } from '../components/ui/States';
import { useApi } from '../hooks/useApi';
import { useDebounce } from '../hooks/useDebounce';
import { eventService, venueService } from '../services/endpoints';
import { mockEvents, mockVenues } from '../services/mockData';
import { formatDate, cn } from '../utils/helpers';
import { toast } from '../hooks/useToast';

const statusFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'published', label: 'Publicados' },
  { value: 'draft', label: 'Borradores' },
];

export default function EventsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const debouncedSearch = useDebounce(search, 250);

  const { data: events, loading, error, refetch, setData } = useApi(
    eventService.getAll,
    { fallback: mockEvents }
  );
  const { data: venues } = useApi(venueService.getAll, { fallback: mockVenues });

  const filtered = useMemo(() => {
    if (!events) return [];
    return events.filter((e) => {
      const matchSearch =
        !debouncedSearch ||
        e.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        e.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [events, debouncedSearch, statusFilter]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('¿Eliminar este evento? Esta acción no se puede deshacer.')) return;
    try {
      await eventService.remove(id);
    } catch {
      // Si la API falla, igual quitamos del estado local
    }
    setData(events.filter((ev) => ev.id !== id));
    toast.success('Evento eliminado');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Catálogo"
        title="Eventos"
        description="Gestiona todos los eventos del estudio: crea nuevos, edita los existentes y revisa su estado."
        actions={
          <Button leftIcon={<Plus size={16} />} onClick={() => navigate('/events/new')}>
            Nuevo evento
          </Button>
        }
      />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-moss-300" />
          <input
            type="search"
            placeholder="Buscar por nombre, descripción…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-moss-100 rounded-lg
                       placeholder:text-ink-400 text-sm focus:outline-none focus:ring-2 focus:ring-moss-200
                       focus:border-moss-300 transition-all"
          />
        </div>
        <div className="inline-flex p-1 bg-cream-100 border border-moss-100 rounded-lg">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                statusFilter === f.value
                  ? 'bg-moss-700 text-cream-50 shadow-sm'
                  : 'text-moss-600 hover:text-moss-700'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Sin eventos para mostrar"
          description="Aún no has creado eventos o ninguno coincide con tu búsqueda."
          action={
            <Button leftIcon={<Plus size={16} />} onClick={() => navigate('/events/new')}>
              Crear el primero
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((event) => {
            const venue = venues?.find((v) => v.id === event.venueId);
            return (
              <Link key={event.id} to={`/events/${event.id}/edit`}>
                <Card hoverable className="h-full flex flex-col group" padding="none">
                  {/* Header con franja de color por categoría */}
                  <div className="h-1.5 bg-gradient-to-r from-moss-500 via-moss-400 to-clay-300 rounded-t-xl" />

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Top */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="default">{event.category}</Badge>
                      <Badge
                        variant={event.status === 'published' ? 'success' : 'warning'}
                        dot
                      >
                        {event.status === 'published' ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </div>

                    {/* Título y descripción */}
                    <h3 className="display-text text-xl text-moss-700 leading-tight mb-2 group-hover:text-moss-800 transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-sm text-ink-500 line-clamp-2 mb-5 flex-1">
                      {event.description}
                    </p>

                    {/* Meta */}
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-xs text-ink-700">
                        <CalendarDays size={13} className="text-moss-400" strokeWidth={1.8} />
                        <span>{formatDate(event.date)} · {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-ink-700">
                        <MapPin size={13} className="text-moss-400" strokeWidth={1.8} />
                        <span className="truncate">{venue?.name || 'Sin sede'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-ink-700">
                        <Users size={13} className="text-moss-400" strokeWidth={1.8} />
                        <span>{event.capacity} cupos</span>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-moss-100">
                      <span className="text-xs text-moss-500 font-medium">Editar evento →</span>
                      <button
                        onClick={(e) => handleDelete(e, event.id)}
                        className="p-1.5 rounded-md text-ink-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
