import { createClient } from '@supabase/supabase-js';

// Use placeholder values if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Create Supabase client (will use mock data if no real credentials provided)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
