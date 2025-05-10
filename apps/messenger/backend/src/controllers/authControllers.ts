// import { type Request, type Response } from 'express';
import { supabaseBackend } from '@shared/supabase/db/supabase-backend';

import { Request, Response } from 'express';

// ==============================
// GITHUB AUTH CALLBACK
// 1. Login
// 2. Logout
// 3. authCallback
// 4. secret
// ==============================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabaseBackend.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ error: error.message });
      return;
    }

    // Check if the user exists in your custom 'users' table
    const { data: existingUser, error: userError } = await supabaseBackend
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      // If the error is not "user not found", handle it
      res.status(500).json({ error: userError.message });
      return;
    }

    if (!existingUser) {
      // If the user doesn't exist, insert the new user into the custom table
      const { data: newUser, error: insertError } = await supabaseBackend
        .from('users')
        .insert([
          {
            id: data.user.id, // Assuming user ID from Supabase
            email: data.user.email, // Store email if needed
            // Add any other fields you want to store for the user (e.g., profile_picture, etc.)
          },
        ])
        .single();

      if (insertError) {
        res.status(401).json({ error: insertError.message });
        return;
      }

      console.log('New user inserted:', newUser);
    }

    // Optionally fetch additional profile data from your custom table (users)
    const { data: profileData, error: profileError } = await supabaseBackend
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      res.status(500).json({ error: profileError.message });
      return; // End function if profile fetch error
    }

    console.log('Profile Data:', profileData);

    // Merge user and profile data
    const mergedData = { ...data.user, ...profileData, session: data.session };

    res.json({
      user: mergedData,
      session: data.session,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabaseBackend.auth.signOut();
    if (error) {
      console.error('Error during logout:', error);
      res.status(400).json({ error: 'Failed to log out' });
      return;
    }

    res.clearCookie('sb-access-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.clearCookie('sb-refresh-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
};

export const authCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.query.code as string | undefined;
  const next = (req.query.next as string | undefined) ?? '/';

  if (code) {
    try {
      await supabaseBackend.auth.exchangeCodeForSession(code);
    } catch (error: any) {
      console.error('Error exchanging code for session:', error);
      res.status(500).json({ error: 'Failed to exchange code for session' });
      return;
    }
  }

  res.redirect(303, `/${next.slice(1)}`);
};

export const secret = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Missing Authorization Token' });
      return;
    }

    // Get user data from the token
    const { data, error } = await supabaseBackend.auth.getUser(token);

    if (error || !data?.user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const userId = data.user.id;

    // Fetch user profile from the database
    const { data: profileData, error: profileError } = await supabaseBackend
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      res.status(500).json({ error: profileError.message });
      return;
    }

    // Merge user and profile data
    const mergedData = { ...data.user, ...profileData };

    // Get the session using the token
    const { data: sessionData, error: sessionError } =
      await supabaseBackend.auth.getSession();

    if (sessionError) {
      res.status(500).json({ error: 'Failed to retrieve session' });
      return;
    }

    const session = sessionData?.session;

    res.json({
      user: mergedData,
      session: session, // Return the session along with the user data
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists in the auth.users table
    const { data: existingUser, error: fetchError } = await supabaseBackend
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('existing user');
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing user:', fetchError);
      res.status(500).json({ error: 'Database error while checking user' });
      return;
    }

    // Proceed with Supabase authentication signup
    const { data, error } = await supabaseBackend.auth.signUp({
      email,
      password,
    });

    if (error) {
      res
        .status(400)
        .json({ error: error.message || 'User registration failed' });
      return;
    }

    if (!data.user) {
      res.status(400).json({ error: 'User registration failed' });
      return;
    }

    console.log('Signup response:', data);

    // Insert user into the custom 'users' table
    const { data: newUser, error: insertError } = await supabaseBackend
      .from('users')
      .insert([{ id: data.user.id, email }])
      .select()
      .single();

    if (insertError) {
      console.error('User insert error:', insertError);
      res.status(500).json({ error: insertError.message });
      return;
    }

    console.log('Inserted user:', newUser);

    const { data: SignInData, error: SignInError } =
      await supabaseBackend.auth.signInWithPassword({
        email,
        password,
      });

    if (SignInError) {
      res.status(401).json({ error: SignInError.message });
      return;
    }

    res.json({ user: newUser, session: SignInData.session });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
