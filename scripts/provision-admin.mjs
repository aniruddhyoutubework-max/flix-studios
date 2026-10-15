/**
 * FlixCore Studios - Elevated Admin Provisioning Script
 *
 * This server-side utility provisions or confirms administrative privileges
 * using the Supabase Service Role Key (bypassing client-side RLS).
 *
 * Usage:
 *   node scripts/provision-admin.mjs [optional_email]
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env if present
function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        env[key] = val;
      }
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '';
const targetEmail = (process.argv[2] || process.env.INITIAL_ADMIN_EMAIL || env.INITIAL_ADMIN_EMAIL || 'flixcorestudios@gmail.com').trim().toLowerCase();

console.log('='.repeat(65));
console.log('  FLIXCORE STUDIOS - ELEVATED ADMINISTRATOR PROVISIONING');
console.log('='.repeat(65));
console.log(`Target Administrator: ${targetEmail}`);

if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project-id')) {
  console.log('\n[NOTICE] Supabase Service Role Key or URL not configured in .env:');
  console.log('  - VITE_SUPABASE_URL:         ' + (supabaseUrl ? 'Configured' : 'Missing'));
  console.log('  - SUPABASE_SERVICE_ROLE_KEY: ' + (serviceRoleKey ? 'Configured' : 'Missing'));
  console.log('\nTo complete manual elevation via the Supabase SQL Editor:');
  console.log('Execute the following SQL query in your Supabase dashboard:');
  console.log('-------------------------------------------------------------');
  console.log(`UPDATE public.profiles SET role = 'admin' WHERE lower(email) = '${targetEmail}';`);
  console.log('-------------------------------------------------------------');
  console.log('\nOr run migration 03: supabase/migrations/03_initial_admin_setup.sql');
  process.exit(0);
}

const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runProvisioning() {
  try {
    console.log('\n[1/3] Checking existing profiles for ' + targetEmail + '...');
    const { data: profiles, error: selectError } = await adminSupabase
      .from('profiles')
      .select('id, email, full_name, role')
      .ilike('email', targetEmail);

    if (selectError) {
      throw new Error(`Profile query error: ${selectError.message}`);
    }

    if (!profiles || profiles.length === 0) {
      console.log(`[!] No profile found for ${targetEmail}.`);
      console.log('    The user has not authenticated yet. Once they register via the website,');
      console.log('    migration 03 trigger or this script will grant them the admin role.');
      return;
    }

    const profile = profiles[0];
    console.log(`[2/3] Found user ${profile.id} with current role: "${profile.role}"`);

    if (profile.role === 'admin') {
      console.log('[3/3] User is already confirmed as administrator. No changes required.');
      return;
    }

    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({ role: 'admin', updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (updateError) {
      throw new Error(`Elevation error: ${updateError.message}`);
    }

    console.log(`[3/3] SUCCESS: Successfully elevated ${targetEmail} to "admin" role!`);
  } catch (err) {
    console.error('[ERROR] Failed to provision admin:', err.message);
    process.exit(1);
  }
}

runProvisioning();
