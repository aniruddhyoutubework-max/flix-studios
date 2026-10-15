import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
let url = '', key = '';
for (const l of lines) {
  if (l.startsWith('VITE_SUPABASE_URL=')) url = l.split('=')[1].trim();
  if (l.startsWith('VITE_SUPABASE_ANON_KEY=')) key = l.split('=')[1].trim();
}

console.log('Testing URL:', url);
console.log('Testing Key format:', key.slice(0, 10));

const supabase = createClient(url, key);
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'flixcorestudios@gmail.com',
    password: 'TemporaryCheckPassword123!'
  });
  console.log('Result:', { data: Boolean(data?.user), error: error ? error.message : null });
} catch (e) {
  console.error('Catch error:', e);
}
