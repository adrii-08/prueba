import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  MapPin,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { LoadingState } from '../components/ui/States';
import { useApi } from '../hooks/useApi';
import {
  eventService,
  attendeeService,
  venueService,
  sponsorService,
} from '../services/endpoints';
import {
  mockEvents,
  mockAttendees,
  mockVenues,
  mockSponsors,
} from '../services/mockData';
import { formatCurrency, formatDate } from '../utils/helpers';

function MetricCard({ label, value, delta, icon: Icon, accent = 'moss' }) {
  const accents = {
    moss: 'bg-moss-50 text-moss-600',
    clay: 'bg-clay-100 text-clay-500',
    ink: 'bg-ink-900 text-cream-50',
  };
  return (
    <Card className="relative overflow-hidden" padding="md">
      <div className="flex items-start justify-between mb-5">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accents[accent]}`}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
        {delta && (
          <Badge variant="success" dot>
            <TrendingUp size={10} /> {delta}
          </Badge>
        )}
      </div>
      <p className="label-mono mb-1">{label}</p>
      <p className="display-text text-3xl text-moss-700 font-semibold">{value}</p>
    </Card>
  );
}

export default function Dashboard() {
  const events = useApi(eventService.getAll, { fallback: mockEvents });
  const attendees = useApi(attendeeService.getAll, { fallback: mockAttendees });
  const venues = useApi(venueService.getAll, { fallback: mockVenues });
  const sponsors = useApi(sponsorService.getAll, { fallback: mockSponsors });

  const loading = events.loading || attendees.loading || venues.loading || sponsors.loading;
  if (loading) return <LoadingState />;

  const totalRevenue =
    sponsors.data?.reduce((sum, s) => sum + (Number(s.amount) || 0), 0) || 0;

  const upcomingEvents = (events.data || [])
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  const recentAttendees = (attendees.data || []).slice(-5).reverse();

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Panel general"
        title="Buenos días, Ever."
        description="Aquí tienes un resumen de la actividad del estudio: eventos próximos, asistentes recientes y patrocinadores activos."
      />

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricCard
          label="Eventos activos"
          value={events.data?.length ?? 0}
          delta="+2"
          icon={CalendarDays}
          accent="moss"
        />
        <MetricCard
          label="Asistentes registrados"
          value={attendees.data?.length ?? 0}
          delta="+18"
          icon={Users}
          accent="moss"
        />
        <MetricCard
          label="Sedes disponibles"
          value={venues.data?.length ?? 0}
          icon={MapPin}
          accent="clay"
        />
        <MetricCard
          label="Ingresos por patrocinio"
          value={formatCurrency(totalRevenue)}
          delta="+12%"
          icon={Sparkles}
          accent="ink"
        />
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximos eventos */}
        <Card className="lg:col-span-2" padding="none">
          <div className="flex items-center justify-between px-6 py-5 border-b border-moss-100">
            <div>
              <h2 className="display-text text-xl text-moss-700">Próximos eventos</h2>
              <p className="text-xs text-ink-500 mt-0.5">
                Los eventos más cercanos en la agenda
              </p>
            </div>
            <Link
              to="/events"
              className="text-xs text-moss-600 hover:text-moss-700 inline-flex items-center gap-1 font-medium"
            >
              Ver todos <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-moss-100">
            {upcomingEvents.length === 0 ? (
              <p className="px-6 py-8 text-sm text-ink-500 text-center">
                No hay eventos próximos.
              </p>
            ) : (
              upcomingEvents.map((event) => {
                const venue = venues.data?.find((v) => v.id === event.venueId);
                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}/edit`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-cream-100 transition-colors group"
                  >
                    <div className="w-14 text-center flex-shrink-0">
                      <p className="display-text text-2xl text-moss-700 leading-none">
                        {new Date(event.date).getDate()}
                      </p>
                      <p className="label-mono text-[10px] mt-1">
                        {new Intl.DateTimeFormat('es-PY', { month: 'short' })
                          .format(new Date(event.date))
                          .replace('.', '')}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink-900 truncate group-hover:text-moss-700 transition-colors">
                        {event.name}
                      </p>
                      <p className="text-xs text-ink-500 mt-0.5">
                        {venue?.name || 'Sin sede asignada'} · {event.time}
                      </p>
                    </div>
                    <Badge
                      variant={event.status === 'published' ? 'success' : 'warning'}
                      dot
                    >
                      {event.status === 'published' ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </Link>
                );
              })
            )}
          </div>
        </Card>

        {/* Asistentes recientes */}
        <Card padding="none">
          <div className="px-6 py-5 border-b border-moss-100">
            <h2 className="display-text text-xl text-moss-700">Asistentes recientes</h2>
            <p className="text-xs text-ink-500 mt-0.5">
              Las últimas inscripciones
            </p>
          </div>
          <ul className="divide-y divide-moss-100">
            {recentAttendees.length === 0 ? (
              <li className="px-6 py-8 text-sm text-ink-500 text-center">
                Aún no hay registros.
              </li>
            ) : (
              recentAttendees.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-6 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-clay-100 text-clay-500 flex items-center justify-center text-sm font-medium font-display">
                    {a.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">
                      {a.name}
                    </p>
                    <p className="text-xs text-ink-500 truncate">{a.email}</p>
                  </div>
                  <Badge variant="default">{a.ticketType}</Badge>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      {/* Insights footer */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="label-mono mb-1">Capacidad total</p>
          <p className="display-text text-2xl text-moss-700">
            {events.data?.reduce((s, e) => s + (e.capacity || 0), 0).toLocaleString()}{' '}
            <span className="text-sm font-sans text-ink-500 font-normal">cupos</span>
          </p>
        </Card>
        <Card>
          <p className="label-mono mb-1">Patrocinadores activos</p>
          <p className="display-text text-2xl text-moss-700">
            {sponsors.data?.length}{' '}
            <span className="text-sm font-sans text-ink-500 font-normal">marcas</span>
          </p>
        </Card>
        <Card>
          <p className="label-mono mb-1">Próximo evento</p>
          <p className="display-text text-lg text-moss-700 truncate">
            {upcomingEvents[0]?.name || '—'}
          </p>
          <p className="text-xs text-ink-500 mt-1">
            {upcomingEvents[0] ? formatDate(upcomingEvents[0].date) : ''}
          </p>
        </Card>
      </div>
    </div>
  );
}
