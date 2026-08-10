import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kujcmhqioutwkzvurfzb.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client for browser & standard operations
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin / Server client with full privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecret || supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
