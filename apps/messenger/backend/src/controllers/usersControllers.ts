import { Request, Response } from 'express';
import { supabaseBackend } from '@shared/supabase/db/supabase-backend';

// 1. GET USERS
// 2. GET USERS STATUS
// 3 UPDATE USER

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all authenticated users
    // const { data: authUsers, error: authError } =
    //   await supabaseBackend.auth.admin.listUsers();

    // Fetch users from the custom users table
    const { data: customUsers, error: customError } = await supabaseBackend
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    // Handle errors
    if (customError) {
      res.status(500).json({
        message: 'Failed to fetch users',
        errors: {
          customError: customError?.message,
        },
      });
      return;
    }

    // Merge users (ensure no duplicates if needed)
    const mergedUsers = customUsers || [];

    res.status(200).json({
      data: {
        users: mergedUsers,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while fetching users',
    });
  }
};

export const getUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a parameter

    // TODO update to only get your friends
    // Fetch the user status from Supabase
    const { data, error } = await supabaseBackend
      .from('users')
      .select('online_status') // Assuming you have a field `online_status`
      .eq('id', userId)
      .single();

    if (error) {
      res.status(500).json({
        message: 'Failed to fetch user status',
        error: error.message,
      });
      return;
    }

    if (!data) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      data: {
        userStatus: data.online_status,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while fetching user status',
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, displayName } = req.body;

    console.log(userId, displayName);

    // Validate required fields
    if (!userId || !displayName) {
      res.status(400).json({
        message: 'User ID, display name, and profile picture are required',
      });
      return;
    }

    // Update the user in the custom users table
    const { data, error } = await supabaseBackend
      .from('users')
      .update({ display_name: displayName }) // Update the field(s)
      .eq('id', userId) // Specify the user to update by ID
      .single(); // Ensure only one row is returned

    if (error) {
      console.log(error);
      // res.status(500).json({ message: 'Failed to update user', error: error.message[0] });
      return;
    }

    res.status(200).json({
      message: 'User updated successfully',
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while updating the user',
    });
  }
};
