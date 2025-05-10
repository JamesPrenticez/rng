import { supabase } from '@shared/supabase/db';

export const signInWithEmail = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return user;
};

export const getUser = () => supabase.auth.getUser();
