import { useState, useMemo } from 'react';
import { Plus, Search, Users, Trash2, Mail, Phone } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { Table, THead, Th, TBody, Tr, Td } from '../components/ui/Table';
import { TableSkeleton, EmptyState, ErrorState } from '../components/ui/States';
import { useApi } from '../hooks/useApi';
import { useDebounce } from '../hooks/useDebounce';
import { useForm } from '../hooks/useForm';
import { attendeeService, eventService } from '../services/endpoints';
import { mockAttendees, mockEvents } from '../services/mockData';
import { validators, formatDate } from '../utils/helpers';
import { toast } from '../hooks/useToast';

const ticketTypes = [
  { value: 'General', label: 'General' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Estudiante', label: 'Estudiante' },
];

export default function AttendeesList() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 250);

  const { data: attendees, loading, error, refetch, setData } = useApi(
    attendeeService.getAll,
    { fallback: mockAttendees }
  );
  const { data: events } = useApi(eventService.getAll, { fallback: mockEvents });

  const filtered = useMemo(() => {
    if (!attendees) return [];
    if (!debouncedSearch) return attendees;
    const q = debouncedSearch.toLowerCase();
    return attendees.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone?.toLowerCase().includes(q)
    );
  }, [attendees, debouncedSearch]);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este asistente?')) return;
    try {
      await attendeeService.remove(id);
    } catch {}
    setData(attendees.filter((a) => a.id !== id));
    toast.success('Asistente eliminado');
  };

  const form = useForm({
    initialValues: { name: '', email: '', phone: '', ticketType: 'General', eventId: '' },
    validations: {
      name: [validators.required, validators.minLength(2)],
      email: [validators.required, validators.email],
      ticketType: [validators.required],
      eventId: [validators.required],
    },
    onSubmit: async (values) => {
      const payload = {
        ...values,
        eventId: Number(values.eventId),
        registeredAt: new Date().toISOString().slice(0, 10),
      };
      let created;
      try {
        created = await attendeeService.create(payload);
      } catch {
        created = { ...payload, id: Date.now() };
      }
      setData([...(attendees || []), created]);
      setModalOpen(false);
      form.reset();
      toast.success('Asistente registrado');
    },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Comunidad"
        title="Asistentes"
        description="Todas las personas registradas en los eventos del estudio."
        actions={
          <Button leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
            Nuevo asistente
          </Button>
        }
      />

      <div className="relative max-w-md mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-moss-300" />
        <input
          type="search"
          placeholder="Buscar por nombre, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-moss-100 rounded-lg
                     placeholder:text-ink-400 text-sm focus:outline-none focus:ring-2 focus:ring-moss-200
                     focus:border-moss-300 transition-all"
        />
      </div>

      {loading ? (
        <Card padding="md"><TableSkeleton rows={6} cols={5} /></Card>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin asistentes registrados"
          description="No hay personas registradas o ninguna coincide con la búsqueda."
          action={
            <Button leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
              Registrar el primero
            </Button>
          }
        />
      ) : (
        <Table>
          <THead>
            <Th>Asistente</Th>
            <Th>Contacto</Th>
            <Th>Evento</Th>
            <Th>Tipo</Th>
            <Th>Registrado</Th>
            <Th className="text-right">Acciones</Th>
          </THead>
          <TBody>
            {filtered.map((a) => {
              const event = events?.find((e) => e.id === a.eventId);
              return (
                <Tr key={a.id} hoverable>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-moss-100 text-moss-600 flex items-center justify-center font-display text-sm">
                        {a.name.charAt(0)}
                      </div>
                      <span className="font-medium text-ink-900">{a.name}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="text-ink-700 flex items-center gap-1.5">
                        <Mail size={11} className="text-moss-300" /> {a.email}
                      </span>
                      {a.phone && (
                        <span className="text-ink-500 flex items-center gap-1.5">
                          <Phone size={11} className="text-moss-300" /> {a.phone}
                        </span>
                      )}
                    </div>
                  </Td>
                  <Td className="text-sm text-ink-700">
                    {event?.name || <span className="text-ink-400">—</span>}
                  </Td>
                  <Td>
                    <Badge
                      variant={
                        a.ticketType === 'VIP' ? 'clay' :
                        a.ticketType === 'Estudiante' ? 'info' :
                        'default'
                      }
                    >
                      {a.ticketType}
                    </Badge>
                  </Td>
                  <Td className="text-xs text-ink-500">{formatDate(a.registeredAt)}</Td>
                  <Td className="text-right">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 rounded-md text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo asistente">
        <div className="space-y-4">
          <Input
            label="Nombre completo"
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.name}
            touched={form.touched.name}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.email}
            touched={form.touched.email}
            required
          />
          <Input
            label="Teléfono"
            name="phone"
            value={form.values.phone}
            onChange={form.handleChange}
          />
          <Select
            label="Evento"
            name="eventId"
            options={(events || []).map((e) => ({ value: e.id, label: e.name }))}
            value={form.values.eventId}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.eventId}
            touched={form.touched.eventId}
            required
          />
          <Select
            label="Tipo de entrada"
            name="ticketType"
            options={ticketTypes}
            value={form.values.ticketType}
            onChange={form.handleChange}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={form.handleSubmit} loading={form.submitting}>
              Registrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
