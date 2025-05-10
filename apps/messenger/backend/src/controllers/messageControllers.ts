// import { type Request, type Response } from 'express';
import { supabaseBackend } from '@shared/supabase/db/supabase-backend';

import { Request, Response } from 'express';

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract conversationId from req.params if needed
    // const { conversationId } = req.params; // Ensure the route has this parameter

    // Fetch messages from the Supabase database
    const { data, error } = await supabaseBackend
      .from('messages')
      .select('*')
      // .eq('conversation_id', conversationId) // Filter by conversationId
      .order('created_at', { ascending: true });

    // Handle Supabase error
    if (error) {
      res.status(500).json({
        message: 'Failed to fetch messages',
        error: error.message,
      });
      return; // Explicitly end the function after sending the response
    }

    // Respond with fetched messages
    res.status(200).json({
      data: {
        messages: data || [],
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while fetching messages',
    });
  }
};
