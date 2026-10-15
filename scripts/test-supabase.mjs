import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Helper to parse env files manually without logging secrets
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

// Load .env and .env.local
const envLocal = loadEnvFile(path.join(projectRoot, '.env.local'));
const envBase = loadEnvFile(path.join(projectRoot, '.env'));
const mergedEnv = { ...envBase, ...envLocal };

const supabaseUrl = (
  mergedEnv.VITE_SUPABASE_URL ||
  mergedEnv.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).trim();

const supabaseKey = (
  mergedEnv.VITE_SUPABASE_ANON_KEY ||
  mergedEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
  mergedEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  mergedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();

console.log('====================================================');
console.log('🔍 FLIX STUDIOS — SUPABASE CONNECTION AUDIT');
console.log('====================================================');

// 1. Audit Variable Presence (Sanitized & Masked)
console.log('\n[1/3] Checking Environment Variables in .env.local:');
if (!supabaseUrl) {
  console.log('  ❌ Supabase URL: MISSING');
} else {
  console.log(`  ✓ Supabase URL: Present (${supabaseUrl})`);
}

if (!supabaseKey) {
  console.log('  ❌ Supabase Key: MISSING');
} else {
  const prefix = supabaseKey.slice(0, 14);
  console.log(`  ✓ Supabase Key: Present (Prefix: ${prefix}***, Length: ${supabaseKey.length} chars)`);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('\n[FATAL] Missing required Supabase credentials in .env.local');
  process.exit(1);
}

// 2. HTTP Endpoint Handshake
console.log('\n[2/3] Testing REST API Handshake:');
const restUrl = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/`;

try {
  const res = await fetch(restUrl, {
    method: 'GET',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  console.log(`  HTTP Status: ${res.status} (${res.statusText})`);
  if (res.ok) {
    const text = await res.text();
    console.log(`  ✓ REST Gateway Responded successfully (Bytes: ${text.length})`);
  } else {
    const errorBody = await res.text();
    console.log(`  ⚠️ Gateway returned non-200 response:`, errorBody);
  }
} catch (fetchErr) {
  console.error(`  ❌ Failed to reach REST endpoint: ${fetchErr.message}`);
}

// 3. Testing Supabase JS Client & Database Tables
console.log('\n[3/3] Testing Supabase Client & Database Schema:');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// A. Test Auth Service
try {
  const { data: authData, error: authErr } = await supabase.auth.getSession();
  if (authErr) {
    console.log(`  ⚠️ Auth Service response: ${authErr.message}`);
  } else {
    console.log('  ✓ Auth Service: Operational (Session endpoint responsive)');
  }
} catch (e) {
  console.log(`  ❌ Auth Service error: ${e.message}`);
}

// B. Test Required Tables
const expectedTables = [
  'site_settings',
  'products',
  'profiles',
  'tickets',
  'ticket_messages',
  'reviews',
  'purchases',
  'audit_logs',
];

console.log('\n  Checking Expected Application Tables:');
const tableResults = {};

for (const table of expectedTables) {
  try {
    const { data, error, status } = await supabase.from(table).select('*').limit(1);
    if (error) {
      tableResults[table] = { ok: false, error: error.message, code: error.code, status };
      console.log(`  - Table "${table}": ❌ Error ${error.code || status} - ${error.message}`);
    } else {
      tableResults[table] = { ok: true, count: data ? data.length : 0, status };
      console.log(`  - Table "${table}": ✓ Accessible (HTTP ${status}, Sample records: ${data ? data.length : 0})`);
    }
  } catch (err) {
    tableResults[table] = { ok: false, error: err.message };
    console.log(`  - Table "${table}": ❌ Exception - ${err.message}`);
  }
}

console.log('\n====================================================');
console.log('📊 AUDIT SUMMARY REPORT');
console.log('====================================================');

const accessibleCount = Object.values(tableResults).filter((r) => r.ok).length;
console.log(`Total Tables Accessible: ${accessibleCount} / ${expectedTables.length}`);

if (accessibleCount === expectedTables.length) {
  console.log('🎉 Supabase is fully configured and all tables are live!');
} else {
  console.log('⚠️ Some tables are missing or require RLS policies / migrations in Supabase.');
}

console.log('\nAudit complete.');
