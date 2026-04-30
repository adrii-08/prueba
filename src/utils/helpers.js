// Formato de moneda en guaraníes (ajustable a tu locale)
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Formato de fecha legible
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-PY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-PY', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

// Validaciones
export const validators = {
  required: (value) => (!value || value.toString().trim() === '' ? 'Este campo es obligatorio' : null),
  email: (value) => {
    if (!value) return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value) ? null : 'Email no válido';
  },
  minLength: (min) => (value) =>
    value && value.length < min ? `Debe tener al menos ${min} caracteres` : null,
  positiveNumber: (value) =>
    value && Number(value) <= 0 ? 'Debe ser un número positivo' : null,
};

// Combinar varios validadores
export const validate = (value, rules = []) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

// Helper de clases condicionales
export const cn = (...classes) => classes.filter(Boolean).join(' ');
