import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hkhdwtuibhdthoccbmsh.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraGR3dHVpYmhkdGhvY2NibXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NjYyNzgsImV4cCI6MjA1MzI0MjI3OH0.ROCeFtsOQ6dTxHWHTI_IPdXQoecy9IcAEkI5YithJW0';

export const supabaseFrontend = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
