
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hrhhezrllnjcclcepedz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyaGhlenJsbG5qY2NsY2VwZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTg4OTAsImV4cCI6MjA2MDAzNDg5MH0.az9-KpVX2NaAOKCEoE7ITgvnMbtw6GdVcdAi5gt-3AY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
