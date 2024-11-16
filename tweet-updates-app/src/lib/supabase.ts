import { createClient } from "@supabase/supabase-js";

// const allVars = {
//     // direct: process.env,  // Node env vars
//     vite: import.meta.env,  // Vite env vars
//     url: import.meta.env.VITE_SUPABASE_URL,
//     key: import.meta.env.VITE_SUPABASE_ANON_KEY,
//   }
//   console.log('All variables:', allVars)
  
//   // Check if env vars are being replaced during build
//   console.log('Build check:', {
//     url: 'VITE_SUPABASE_URL',
//     key: 'VITE_SUPABASE_ANON_KEY'
//   })

const supabaseURL = import.meta.env.VITE_SUPABASE_URL
const supabaseKey= import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseURL || !supabaseKey) {
    throw new Error('Missing Supabase env variables')
}

export const supabase = createClient(supabaseURL, supabaseKey);
