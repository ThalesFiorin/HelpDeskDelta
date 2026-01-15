import { createClient } from '@supabase/supabase-js';

// Agora sim: Usando o padrão VITE (que é o que configuramos na Vercel)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Trava de segurança: Se não achar as chaves, avisa o erro real em vez de tentar url falsa
if (!supabaseUrl || !supabaseKey) {
  throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram encontradas.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);