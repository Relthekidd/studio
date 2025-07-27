import { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/supabase';

export interface SupabaseQueryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export function useSupabaseQuery<T>(
  fn: (client: SupabaseClient) => Promise<T>
): SupabaseQueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const client = supabaseBrowser();
    setLoading(true);
    fn(client)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, success: !loading && !error };
}
