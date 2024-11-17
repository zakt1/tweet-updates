import { createClient } from "@supabase/supabase-js";


const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Changed to match .env file name

if (!supabaseURL || !supabaseKey) {
    throw new Error(`Missing Supabase env variables:
    URL: ${supabaseURL}
    Key: ${supabaseKey}
    `);
}

export const supabase = createClient(supabaseURL, supabaseKey);