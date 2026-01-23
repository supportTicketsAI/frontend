import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging con valores ocultos para seguridad
console.log('🔍 Supabase Config:', { 
    url: supabaseUrl ? `✅ ${supabaseUrl.substring(0, 20)}...` : '❌ Falta',
    key: supabaseAnonKey ? `✅ ${supabaseAnonKey.substring(0, 20)}...` : '❌ Falta'
});

// Debug adicional para ver valores exactos
console.log('🔍 Environment Debug:', {
    'import.meta.env.VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
    'import.meta.env.VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY ? 'defined' : 'undefined',
    'All env keys': Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
});

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = [
    '❌ Missing Supabase environment variables! Please check your .env file.',
    'Expected variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY',
    `Current values: URL=${supabaseUrl || 'undefined'}, KEY=${supabaseAnonKey ? 'defined' : 'undefined'}`,
    '🔧 For deployment, ensure variables are set in your hosting platform.'
  ];
  
  errorMsg.forEach(msg => console.error(msg));
  throw new Error('Missing Supabase configuration. Check environment variables.');
}

export const supabase = createClient(
    supabaseUrl, 
    supabaseAnonKey,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
);
