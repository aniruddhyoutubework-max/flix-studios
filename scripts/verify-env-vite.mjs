import { loadEnv } from 'vite';

const cwd = process.cwd();
const env = loadEnv('development', cwd, ['VITE_', 'NEXT_PUBLIC_']);

console.log('--- Vite loadEnv Test ---');
console.log('Project CWD:', cwd);
console.log('VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL ? 'Loaded (valid URL)' : 'Missing');
console.log('VITE_SUPABASE_ANON_KEY:', env.VITE_SUPABASE_ANON_KEY ? 'Loaded (valid length: ' + env.VITE_SUPABASE_ANON_KEY.length + ')' : 'Missing');
console.log('NEXT_PUBLIC_SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL ? 'Loaded' : 'Missing');
console.log('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:', env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? 'Loaded' : 'Missing');
