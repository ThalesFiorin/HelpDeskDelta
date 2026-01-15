import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu projeto Supabase
// Em produção, use process.env.REACT_APP_SUPABASE_URL etc.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://sua-url-do-projeto.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sua-chave-anonima-publica';

export const supabase = createClient(supabaseUrl, supabaseKey);