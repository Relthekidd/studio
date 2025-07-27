import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from './env';

export const supabaseBrowser = () =>
  createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

export const supabaseServer = () =>
  createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
        setAll: async (items) => {
          const store = await cookies();
          items.forEach((c) => store.set(c));
        },
      },
    }
  );
