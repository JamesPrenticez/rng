import { supabaseBackend } from '@shared/supabase/db/supabase-backend';
import type { Request, Response } from 'express';

// 1. Get Contacts
// 2. Add Contact

export const getContacts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a parameter in the URL

    // Fetch friends from Supabase and join with users table, then map the result
    const { data, error } = await supabaseBackend
      .from('friends')
      .select('*, users!friends_friend_id_fkey(*)') // Explicit join
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    const friendsList = data?.map((friend) => friend.users) ?? [];

    if (error) {
      res.status(500).json({
        message: 'Failed to fetch friends',
        error: error.message,
      });
      return;
    }

    res.status(200).json({
      data: {
        contacts: friendsList,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while fetching friends',
    });
  }
};

export const addContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, contactId } = req.body; // Assuming userId and friendId are passed in the body

    // Check if the friend already exists in the user's friend list (optional)
    const { data: existingFriend, error: existingFriendError } =
      await supabaseBackend
        .from('friends')
        .select('*')
        .eq('user_id', userId)
        .eq('friend_id', contactId)
        .single();

    if (existingFriendError && existingFriendError.code !== 'PGRST116') {
      res.status(500).json({
        message: 'Error checking if friend exists',
        error: existingFriendError.message,
      });
      return;
    }

    if (existingFriend) {
      res.status(400).json({ message: 'Friend already added' });
      return;
    }

    // Add friend to the database
    const { error } = await supabaseBackend.from('friends').insert([
      {
        user_id: userId,
        friend_id: contactId,
      },
    ]);

    if (error) {
      res.status(500).json({
        message: 'Failed to add friend',
        error: error.message,
      });
      return;
    }

    res.status(200).json({
      message: 'Friend added successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while adding a friend',
    });
  }
};
