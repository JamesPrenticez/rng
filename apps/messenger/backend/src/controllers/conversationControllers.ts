// import { type Request, type Response } from 'express';
import { supabaseBackend } from '@shared/supabase/db/supabase-backend';

import { Request, Response } from 'express';

// TODO make this Admin only

// ==============================
// GET
// ==============================
export const getConversations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract conversationId from req.params if needed
    // const { userId } = req.params; // Ensure the route has this parameter

    // Fetch messages from the Supabase database
    const { data, error } = await supabaseBackend
      .from('conversations')
      .select('*')
      // .eq('', conversationId) // Filter by conversationId
      .order('created_at', { ascending: true });

    console.log(data);

    // Handle Supabase error
    if (error) {
      res.status(500).json({
        message: 'Failed to fetch conversations',
        error: error.message,
      });
      return; // Explicitly end the function after sending the response
    }

    // Respond with fetched messages
    res.status(200).json({
      data: {
        conversations: data || [],
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while fetching conversations',
    });
  }
};

// ==============================
// POST
// ==============================
export const createConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, permissions } = req.body;
    const user = { id: '1', name: 'admin' }; // From middleware, or decode the token

    if (!user || !user.id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    console.log(title, permissions);

    // Validate input
    if (!title) {
      res.status(400).json({ message: 'Conversation title is required' });
      return;
    }

    // Create a conversation object
    const { data, error } = await supabaseBackend
      .from('conversations')
      .insert([
        {
          title,
          // permissions: permissions || null, // Optional field for permissions
          created_at: new Date().toISOString(),
          user_id: user.id,
        },
      ])
      .single();

    console.log(data, error);

    // Handle Supabase error
    if (error) {
      res.status(500).json({
        message: 'Failed to create conversation',
        error: error.message,
      });
      return;
    }

    res.status(201).json({
      message: 'Conversation created successfully',
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while creating the conversation',
    });
  }
};
