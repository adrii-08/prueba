import { useState } from 'react';
import { Plus, MapPin, Users2, Trash2, Building2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { CardSkeleton, EmptyState, ErrorState } from '../components/ui/States';
import { useApi } from '../hooks/useApi';
import { useForm } from '../hooks/useForm';
import { venueService } from '../services/endpoints';
import { mockVenues } from '../services/mockData';
import { validators } from '../utils/helpers';
import { toast } from '../hooks/useToast';

const venueTypes = [
  { value: 'Convenciones', label: 'Centro de convenciones' },
  { value: 'Auditorio', label: 'Auditorio' },
  { value: 'Aire libre', label: 'Aire libre' },
  { value: 'Salón', label: 'Salón privado' },
  { value: 'Hotel', label: 'Hotel / Resort' },
];

export default function VenuesList() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: venues, loading, error, refetch, setData } = useApi(
    venueService.getAll,
    { fallback: mockVenues }
  );

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta sede?')) return;
    try {
      await venueService.remove(id);
    } catch {}
    setData(venues.filter((v) => v.id !== id));
    toast.success('Sede eliminada');
  };

  const form = useForm({
    initialValues: { name: '', address: '', city: '', capacity: '', type: 'Auditorio' },
    validations: {
      name: [validators.required, validators.minLength(3)],
      address: [validators.required],
      city: [validators.required],
      capacity: [validators.required, validators.positiveNumber],
      type: [validators.required],
    },
    onSubmit: async (values) => {
      const payload = { ...values, capacity: Number(values.capacity) };
      let created;
      try {
        created = await venueService.create(payload);
      } catch {
        created = { ...payload, id: Date.now() };
      }
      setData([...(venues || []), created]);
      setModalOpen(false);
      form.reset();
      toast.success('Sede creada');
    },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Espacios"
        title="Sedes"
        description="Lugares disponibles para los eventos del estudio."
        actions={
          <Button leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
            Nueva sede
          </Button>
        }
      />

      {loading ? (
        <CardSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !venues || venues.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Sin sedes registradas"
          description="Agrega tu primera sede para empezar a asignarla a eventos."
          action={
            <Button leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
              Crear primera sede
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {venues.map((v) => (
            <Card key={v.id} padding="none" className="overflow-hidden group">
              {/* Header decorativo */}
              <div className="relative h-28 bg-gradient-to-br from-moss-500 via-moss-600 to-moss-700 flex items-end p-5">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)'
                }} />
                <div className="absolute top-4 right-4">
                  <Badge variant="ink" className="bg-cream-50/15 text-cream-50 border-cream-50/20">
                    {v.type}
                  </Badge>
                </div>
                <Building2 size={36} className="text-cream-50/30" strokeWidth={1.2} />
              </div>

              <div className="p-5">
                <h3 className="display-text text-lg text-moss-700 leading-tight mb-1">{v.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-4">
                  <MapPin size={12} className="text-moss-300" />
                  <span>{v.address}, {v.city}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-moss-100">
                  <div className="flex items-center gap-1.5 text-sm text-ink-700">
                    <Users2 size={14} className="text-moss-400" />
                    <span className="font-mono">{v.capacity.toLocaleString()}</span>
                    <span className="text-ink-500 text-xs">cupos</span>
                  </div>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-1.5 rounded-md text-ink-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva sede">
        <div className="space-y-4">
          <Input
            label="Nombre"
            name="name"
            placeholder="Centro de Convenciones…"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.name}
            touched={form.touched.name}
            required
          />
          <Input
            label="Dirección"
            name="address"
            value={form.values.address}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.address}
            touched={form.touched.address}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ciudad"
              name="city"
              value={form.values.city}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.city}
              touched={form.touched.city}
              required
            />
            <Input
              label="Capacidad"
              name="capacity"
              type="number"
              value={form.values.capacity}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.capacity}
              touched={form.touched.capacity}
              required
            />
          </div>
          <Select
            label="Tipo"
            name="type"
            options={venueTypes}
            value={form.values.type}
            onChange={form.handleChange}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={form.handleSubmit} loading={form.submitting}>
              Crear sede
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
