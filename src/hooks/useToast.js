import { useState, useCallback } from 'react';

let listeners = [];
let toasts = [];
let nextId = 1;

const notify = () => listeners.forEach((l) => l([...toasts]));

export const toast = {
  success: (msg) => addToast(msg, 'success'),
  error: (msg) => addToast(msg, 'error'),
  info: (msg) => addToast(msg, 'info'),
};

function addToast(message, type) {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 3500);
}

export function useToast() {
  const [items, setItems] = useState(toasts);
  const dismiss = useCallback((id) => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, []);

  // Suscripción
  useState(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((l) => l !== setItems);
    };
  });

  return { toasts: items, dismiss };
}
