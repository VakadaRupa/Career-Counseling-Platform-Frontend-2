import { supabase } from './supabase';

/**
 * Logs a user activity to Supabase
 * @param {string} userId - The ID of the user
 * @param {string} type - The type of activity ('job', 'course', 'chat', 'forum')
 * @param {string} title - The title/description of the activity
 */
export const logActivity = async (userId, type, title) => {
  try {
    const { error } = await supabase
      .from('activities')
      .insert([
        { user_id: userId, type, title, created_at: new Date().toISOString() }
      ]);
    if (error) throw error;
  } catch (err) {
    console.error('Error logging activity:', err);
  }
};
