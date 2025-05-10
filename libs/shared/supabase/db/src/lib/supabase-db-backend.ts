import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hkhdwtuibhdthoccbmsh.supabase.co';
const VITE_SUPABASE_SERVICE_ROLE = process.env.VITE_SUPABASE_SERVICE_ROLE || '';

export const supabaseBackend = createClient(
  SUPABASE_URL,
  VITE_SUPABASE_SERVICE_ROLE
);
