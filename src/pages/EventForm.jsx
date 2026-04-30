import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Users,
  Sparkles,
  CalendarDays,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { LoadingState } from '../components/ui/States';
import { useApi } from '../hooks/useApi';
import { useForm } from '../hooks/useForm';
import {
  eventService,
  venueService,
  attendeeService,
  sponsorService,
} from '../services/endpoints';
import {
  mockEvents,
  mockVenues,
  mockAttendees,
  mockSponsors,
} from '../services/mockData';
import { validators, formatCurrency } from '../utils/helpers';
import { toast } from '../hooks/useToast';

const eventCategories = [
  { value: 'Conferencia', label: 'Conferencia' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Gala', label: 'Gala' },
  { value: 'Networking', label: 'Networking' },
];

const ticketTypes = [
  { value: 'General', label: 'General' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Estudiante', label: 'Estudiante' },
];

const sponsorTiers = [
  { value: 'Platino', label: 'Platino' },
  { value: 'Oro', label: 'Oro' },
  { value: 'Plata', label: 'Plata' },
  { value: 'Bronce', label: 'Bronce' },
];

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Sedes
  const { data: venues } = useApi(venueService.getAll, { fallback: mockVenues });

  // Si estamos editando, cargamos el evento
  const [initialData, setInitialData] = useState(null);
  const [eventLocalId, setEventLocalId] = useState(isEditing ? Number(id) : null);
  const [loadingEvent, setLoadingEvent] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) {
      setInitialData({
        name: '',
        description: '',
        date: '',
        time: '',
        capacity: '',
        category: '',
        status: 'draft',
        venueId: '',
      });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await eventService.getById(id);
        if (!cancelled) setInitialData(data);
      } catch {
        const local = mockEvents.find((e) => e.id === Number(id));
        if (!cancelled) setInitialData(local || null);
      } finally {
        if (!cancelled) setLoadingEvent(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isEditing]);

  // Asistentes y patrocinadores asociados al evento
  const [attendees, setAttendees] = useState([]);
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    if (!eventLocalId) return;
    (async () => {
      try {
        const a = await attendeeService.getByEvent(eventLocalId);
        setAttendees(a || []);
      } catch {
        setAttendees(mockAttendees.filter((x) => x.eventId === eventLocalId));
      }
      try {
        const s = await sponsorService.getByEvent(eventLocalId);
        setSponsors(s || []);
      } catch {
        setSponsors(mockSponsors.filter((x) => x.eventId === eventLocalId));
      }
    })();
  }, [eventLocalId]);

  const form = useForm({
    initialValues: initialData || {},
    validations: {
      name: [validators.required, validators.minLength(3)],
      description: [validators.required],
      date: [validators.required],
      time: [validators.required],
      capacity: [validators.required, validators.positiveNumber],
      category: [validators.required],
      venueId: [validators.required],
    },
    onSubmit: async (values) => {
      try {
        const payload = { ...values, capacity: Number(values.capacity), venueId: Number(values.venueId) };
        if (isEditing) {
          await eventService.update(id, payload);
          toast.success('Evento actualizado');
        } else {
          const created = await eventService.create(payload);
          setEventLocalId(created?.id);
          toast.success('Evento creado correctamente');
        }
        navigate('/events');
      } catch (err) {
        // Si la API falla, simulamos éxito local para no bloquear la demo
        toast.success(isEditing ? 'Evento actualizado (modo local)' : 'Evento creado (modo local)');
        navigate('/events');
      }
    },
  });

  // Inicializa los valores del form cuando llegan datos
  useEffect(() => {
    if (initialData) form.setValues(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Modales
  const [attendeeModal, setAttendeeModal] = useState(false);
  const [sponsorModal, setSponsorModal] = useState(false);

  if (loadingEvent || !initialData) return <LoadingState message="Cargando evento…" />;

  const totalSponsored = sponsors.reduce((s, sp) => s + Number(sp.amount || 0), 0);

  return (
    <div className="animate-fade-in max-w-5xl">
      <button
        onClick={() => navigate('/events')}
        className="inline-flex items-center gap-1.5 text-sm text-moss-500 hover:text-moss-700 mb-4 transition-colors"
      >
        <ArrowLeft size={14} /> Volver a eventos
      </button>

      <PageHeader
        eyebrow={isEditing ? 'Editando evento' : 'Nuevo evento'}
        title={isEditing ? form.values.name || 'Editar evento' : 'Crear evento'}
        description={
          isEditing
            ? 'Actualiza los detalles, asistentes y patrocinadores de este evento.'
            : 'Completa la información del evento. Podrás añadir asistentes y patrocinadores luego.'
        }
      />

      <form onSubmit={form.handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal: datos del evento */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="display-text text-xl text-moss-700 mb-1">Información general</h2>
            <p className="text-xs text-ink-500 mb-6">Detalles principales del evento</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Nombre del evento"
                name="name"
                placeholder="Conferencia de Innovación 2026"
                value={form.values.name || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.name}
                touched={form.touched.name}
                required
                className="md:col-span-2"
              />
              <Input
                label="Descripción"
                name="description"
                type="textarea"
                placeholder="Una breve descripción del evento, su propósito y público objetivo."
                value={form.values.description || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.description}
                touched={form.touched.description}
                required
                className="md:col-span-2"
              />
              <Input
                label="Fecha"
                name="date"
                type="date"
                value={form.values.date || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.date}
                touched={form.touched.date}
                required
              />
              <Input
                label="Hora"
                name="time"
                type="time"
                value={form.values.time || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.time}
                touched={form.touched.time}
                required
              />
              <Input
                label="Capacidad"
                name="capacity"
                type="number"
                placeholder="200"
                value={form.values.capacity || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.capacity}
                touched={form.touched.capacity}
                hint="Número máximo de asistentes"
                required
              />
              <Select
                label="Categoría"
                name="category"
                options={eventCategories}
                value={form.values.category || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.category}
                touched={form.touched.category}
                required
              />
            </div>
          </Card>

          <Card>
            <h2 className="display-text text-xl text-moss-700 mb-1">Sede</h2>
            <p className="text-xs text-ink-500 mb-6">
              Elige la sede donde se llevará a cabo el evento
            </p>
            <Select
              label="Selecciona una sede"
              name="venueId"
              options={(venues || []).map((v) => ({
                value: v.id,
                label: `${v.name} — ${v.city} (cap. ${v.capacity})`,
              }))}
              value={form.values.venueId || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.venueId}
              touched={form.touched.venueId}
              required
            />

            {form.values.venueId && venues && (
              <div className="mt-4 p-4 rounded-lg bg-cream-100 border border-moss-100">
                {(() => {
                  const v = venues.find((x) => x.id === Number(form.values.venueId));
                  if (!v) return null;
                  return (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="display-text text-base text-moss-700">{v.name}</p>
                        <p className="text-xs text-ink-500 mt-0.5">
                          {v.address} · {v.city}
                        </p>
                      </div>
                      <Badge variant="clay">{v.type}</Badge>
                    </div>
                  );
                })()}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar derecha: estado, asistentes, sponsors */}
        <div className="space-y-6">
          <Card>
            <h2 className="display-text text-xl text-moss-700 mb-1">Estado</h2>
            <p className="text-xs text-ink-500 mb-5">Visibilidad del evento</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'draft', label: 'Borrador' },
                { value: 'published', label: 'Publicado' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => form.setValue('status', opt.value)}
                  className={`px-3 py-2.5 text-sm rounded-lg border transition-all ${
                    form.values.status === opt.value
                      ? 'bg-moss-700 text-cream-50 border-moss-700 shadow-sm'
                      : 'bg-cream-50 border-moss-100 text-ink-700 hover:border-moss-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>

          <Button
            type="submit"
            loading={form.submitting}
            leftIcon={<Save size={16} />}
            className="w-full"
            size="lg"
          >
            {isEditing ? 'Guardar cambios' : 'Crear evento'}
          </Button>

          {form.submitError && (
            <p className="text-xs text-red-600 text-center">{form.submitError}</p>
          )}
        </div>

        {/* Sección de asistentes y patrocinadores (solo cuando se está editando o ya hay id) */}
        {isEditing && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {/* Asistentes */}
            <Card padding="none">
              <div className="flex items-center justify-between px-6 py-4 border-b border-moss-100">
                <div>
                  <h2 className="display-text text-lg text-moss-700 flex items-center gap-2">
                    <Users size={16} /> Asistentes
                  </h2>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {attendees.length} registrados
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus size={14} />}
                  onClick={() => setAttendeeModal(true)}
                >
                  Agregar
                </Button>
              </div>

              {attendees.length === 0 ? (
                <p className="px-6 py-10 text-sm text-ink-500 text-center">
                  Aún no hay asistentes para este evento.
                </p>
              ) : (
                <ul className="divide-y divide-moss-100">
                  {attendees.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 px-6 py-3">
                      <div className="w-8 h-8 rounded-full bg-moss-100 text-moss-600 flex items-center justify-center text-sm font-display">
                        {a.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900 truncate">{a.name}</p>
                        <p className="text-xs text-ink-500 truncate">{a.email}</p>
                      </div>
                      <Badge>{a.ticketType}</Badge>
                      <button
                        type="button"
                        onClick={() => setAttendees(attendees.filter((x) => x.id !== a.id))}
                        className="p-1 text-ink-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Patrocinadores */}
            <Card padding="none">
              <div className="flex items-center justify-between px-6 py-4 border-b border-moss-100">
                <div>
                  <h2 className="display-text text-lg text-moss-700 flex items-center gap-2">
                    <Sparkles size={16} /> Patrocinadores
                  </h2>
                  <p className="text-xs text-ink-500 mt-0.5">
                    Total: <span className="text-clay-500 font-medium">{formatCurrency(totalSponsored)}</span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus size={14} />}
                  onClick={() => setSponsorModal(true)}
                >
                  Agregar
                </Button>
              </div>

              {sponsors.length === 0 ? (
                <p className="px-6 py-10 text-sm text-ink-500 text-center">
                  Sin patrocinadores aún.
                </p>
              ) : (
                <ul className="divide-y divide-moss-100">
                  {sponsors.map((s) => (
                    <li key={s.id} className="flex items-center gap-3 px-6 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900 truncate">{s.name}</p>
                        <p className="text-xs text-ink-500 truncate">{s.contact}</p>
                      </div>
                      <Badge variant="clay">{s.tier}</Badge>
                      <span className="text-sm font-mono text-moss-700 font-medium">
                        {formatCurrency(s.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSponsors(sponsors.filter((x) => x.id !== s.id))}
                        className="p-1 text-ink-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        )}
      </form>

      {/* Modal: agregar asistente */}
      <Modal
        open={attendeeModal}
        onClose={() => setAttendeeModal(false)}
        title="Agregar asistente"
      >
        <AttendeeQuickForm
          eventId={eventLocalId}
          onAdd={(att) => {
            setAttendees([...attendees, att]);
            setAttendeeModal(false);
            toast.success('Asistente agregado');
          }}
        />
      </Modal>

      {/* Modal: agregar patrocinador */}
      <Modal
        open={sponsorModal}
        onClose={() => setSponsorModal(false)}
        title="Agregar patrocinador"
      >
        <SponsorQuickForm
          eventId={eventLocalId}
          onAdd={(sp) => {
            setSponsors([...sponsors, sp]);
            setSponsorModal(false);
            toast.success('Patrocinador agregado');
          }}
        />
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Subformulario: agregar asistente rápidamente
// ─────────────────────────────────────────────────────────────
function AttendeeQuickForm({ eventId, onAdd }) {
  const form = useForm({
    initialValues: { name: '', email: '', phone: '', ticketType: 'General' },
    validations: {
      name: [validators.required, validators.minLength(2)],
      email: [validators.required, validators.email],
      ticketType: [validators.required],
    },
    onSubmit: async (values) => {
      const payload = { ...values, eventId, registeredAt: new Date().toISOString().slice(0, 10) };
      try {
        const created = await attendeeService.create(payload);
        onAdd(created || { ...payload, id: Date.now() });
      } catch {
        onAdd({ ...payload, id: Date.now() });
      }
    },
  });

  return (
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
        placeholder="nombre@correo.com"
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
        placeholder="+595 …"
        value={form.values.phone}
        onChange={form.handleChange}
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
        <Button
          onClick={form.handleSubmit}
          loading={form.submitting}
          leftIcon={<Plus size={14} />}
        >
          Agregar
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Subformulario: agregar patrocinador con monto
// ─────────────────────────────────────────────────────────────
function SponsorQuickForm({ eventId, onAdd }) {
  const form = useForm({
    initialValues: { name: '', contact: '', amount: '', tier: 'Plata' },
    validations: {
      name: [validators.required, validators.minLength(2)],
      contact: [validators.required, validators.email],
      amount: [validators.required, validators.positiveNumber],
      tier: [validators.required],
    },
    onSubmit: async (values) => {
      const payload = { ...values, amount: Number(values.amount), eventId };
      try {
        const created = await sponsorService.create(payload);
        onAdd(created || { ...payload, id: Date.now() });
      } catch {
        onAdd({ ...payload, id: Date.now() });
      }
    },
  });

  return (
    <div className="space-y-4">
      <Input
        label="Nombre del patrocinador"
        name="name"
        value={form.values.name}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.name}
        touched={form.touched.name}
        required
      />
      <Input
        label="Email de contacto"
        name="contact"
        type="email"
        value={form.values.contact}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.contact}
        touched={form.touched.contact}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Monto (USD)"
          name="amount"
          type="number"
          placeholder="5000"
          value={form.values.amount}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.amount}
          touched={form.touched.amount}
          required
        />
        <Select
          label="Tier"
          name="tier"
          options={sponsorTiers}
          value={form.values.tier}
          onChange={form.handleChange}
          required
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          onClick={form.handleSubmit}
          loading={form.submitting}
          leftIcon={<Plus size={14} />}
        >
          Agregar
        </Button>
      </div>
    </div>
  );
}
