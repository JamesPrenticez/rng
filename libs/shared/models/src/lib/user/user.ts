import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  display_name?: string;
  profile_picture?: string;
}

export interface SessionData {
  user: User | null;
  session: Session | null;
}
