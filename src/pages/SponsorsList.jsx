import { useState, useMemo } from 'react';
import { Plus, Search, Sparkles, Trash2, TrendingUp } from 'lucide-react';
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
import { sponsorService, eventService } from '../services/endpoints';
import { mockSponsors, mockEvents } from '../services/mockData';
import { validators, formatCurrency } from '../utils/helpers';
import { toast } from '../hooks/useToast';

const sponsorTiers = [
  { value: 'Platino', label: 'Platino' },
  { value: 'Oro', label: 'Oro' },
  { value: 'Plata', label: 'Plata' },
  { value: 'Bronce', label: 'Bronce' },
];

const tierVariant = {
  Platino: 'ink',
  Oro: 'warning',
  Plata: 'default',
  Bronce: 'clay',
};

export default function SponsorsList() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 250);

  const { data: sponsors, loading, error, refetch, setData } = useApi(
    sponsorService.getAll,
    { fallback: mockSponsors }
  );
  const { data: events } = useApi(eventService.getAll, { fallback: mockEvents });

  const filtered = useMemo(() => {
    if (!sponsors) return [];
    if (!debouncedSearch) return sponsors;
    const q = debouncedSearch.toLowerCase();
    return sponsors.filter(
      (s) => s.name.toLowerCase().includes(q) || s.contact?.toLowerCase().includes(q)
    );
  }, [sponsors, debouncedSearch]);

  const totalAmount = useMemo(
    () => (sponsors || []).reduce((sum, s) => sum + Number(s.amount || 0), 0),
    [sponsors]
  );

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este patrocinador?')) return;
    try {
      await sponsorService.remove(id);
    } catch {}
    setData(sponsors.filter((s) => s.id !== id));
    toast.success('Patrocinador eliminado');
  };

  const form = useForm({
    initialValues: { name: '', contact: '', amount: '', tier: 'Plata', eventId: '' },
    validations: {
      name: [validators.required, validators.minLength(2)],
      contact: [validators.required, validators.email],
      amount: [validators.required, validators.positiveNumber],
      tier: [validators.required],
      eventId: [validators.required],
    },
    onSubmit: async (values) => {
      const payload = { ...values, amount: Number(values.amount), eventId: Number(values.eventId) };
      let created;
      try {
        created = await sponsorService.create(payload);
      } catch {
        created = { ...payload, id: Date.now() };
      }
      setData([...(sponsors || []), created]);
      setModalOpen(false);
      form.reset();
      toast.success('Patrocinador agregado');
    },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Alianzas"
        title="Patrocinadores"
        description="Marcas y empresas que apoyan los eventos del estudio."
        actions={
          <Button leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
            Nuevo patrocinador
          </Button>
        }
      />

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="label-mono mb-1">Total recaudado</p>
          <p className="display-text text-3xl text-moss-700">{formatCurrency(totalAmount)}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-700">
            <TrendingUp size={11} /> +12% vs trimestre anterior
          </div>
        </Card>
        <Card>
          <p className="label-mono mb-1">Patrocinadores</p>
          <p className="display-text text-3xl text-moss-700">{sponsors?.length || 0}</p>
        </Card>
        <Card>
          <p className="label-mono mb-1">Promedio por patrocinio</p>
          <p className="display-text text-3xl text-moss-700">
            {formatCurrency(sponsors?.length ? totalAmount / sponsors.length : 0)}
          </p>
        </Card>
      </div>

      <div className="relative max-w-md mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-moss-300" />
        <input
          type="search"
          placeholder="Buscar patrocinador…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-moss-100 rounded-lg
                     placeholder:text-ink-400 text-sm focus:outline-none focus:ring-2 focus:ring-moss-200
                     focus:border-moss-300 transition-all"
        />
      </div>

      {loading ? (
        <Card padding="md"><TableSkeleton rows={5} cols={5} /></Card>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Sin patrocinadores"
          description="Agrega marcas que apoyen tus eventos."
          action={
            <Button leftIcon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
              Agregar el primero
            </Button>
          }
        />
      ) : (
        <Table>
          <THead>
            <Th>Marca</Th>
            <Th>Contacto</Th>
            <Th>Evento</Th>
            <Th>Tier</Th>
            <Th className="text-right">Monto</Th>
            <Th className="text-right">Acciones</Th>
          </THead>
          <TBody>
            {filtered.map((s) => {
              const event = events?.find((e) => e.id === s.eventId);
              return (
                <Tr key={s.id} hoverable>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-clay-200 to-clay-300 text-cream-50 flex items-center justify-center font-display text-sm font-semibold">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium text-ink-900">{s.name}</span>
                    </div>
                  </Td>
                  <Td className="text-xs text-ink-500">{s.contact}</Td>
                  <Td className="text-sm text-ink-700">
                    {event?.name || <span className="text-ink-400">—</span>}
                  </Td>
                  <Td>
                    <Badge variant={tierVariant[s.tier] || 'default'} dot>
                      {s.tier}
                    </Badge>
                  </Td>
                  <Td className="text-right font-mono font-medium text-moss-700">
                    {formatCurrency(s.amount)}
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={() => handleDelete(s.id)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo patrocinador">
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
          <Select
            label="Evento asociado"
            name="eventId"
            options={(events || []).map((e) => ({ value: e.id, label: e.name }))}
            value={form.values.eventId}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.errors.eventId}
            touched={form.touched.eventId}
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
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={form.handleSubmit} loading={form.submitting}>
              Agregar patrocinador
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
