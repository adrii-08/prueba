import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para llamadas a API.
 * - Maneja estados loading / error / data
 * - Permite fallback a datos mock si la API falla
 * - Expone refetch() para refrescar
 */
export function useApi(fetcher, { fallback = null, deps = [], immediate = true } = {}) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      // Si tenemos fallback, lo usamos en lugar de mostrar error puro
      if (fallback !== null) {
        setData(fallback);
        setError(null);
      } else {
        setError(err.message || 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return { data, loading, error, refetch: execute, setData };
}
