import { createClient } from '@supabase/supabase-js';

// Tenta pegar as variáveis usando o padrão moderno (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação de segurança: Se não achar as chaves, avisa no console
if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO CRÍTICO: Variáveis de ambiente do Supabase não encontradas!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);