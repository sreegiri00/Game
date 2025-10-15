import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://YOUR_PROJECT_URL.supabase.co"; // 🔑 replace with your project URL
const supabaseAnonKey = "YOUR_PUBLIC_ANON_KEY"; // 🔑 replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
