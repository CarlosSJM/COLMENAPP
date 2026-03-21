import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export function useApiData<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFn()
      .then(setData)
      .catch((err) => {
        setError(err.message);
        toast.error(err.message || 'Error al cargar datos');
      })
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => { reload(); }, [reload]);

  return { data, loading, error, reload, setData };
}
