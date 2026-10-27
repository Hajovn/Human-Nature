// Checks the database access rules (docs/SUPABASE-PLAN.md, Stage 3) against the DEVELOPMENT
// project. Creates throw-away users, invite codes and a file, tests what each user can and
// can't do, then removes everything again.
//
//   npm run test:rls
//
// Needs in .env.local: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY and
// SUPABASE_SECRET_KEY (dev project only — never the live one, never committed).
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !publishableKey || !secretKey) {
  console.error('Missing VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY or SUPABASE_SECRET_KEY in .env.local');
  process.exit(1);
}
if (url.includes('uifazscyhvybdxvlmzmv')) {
  console.error('This is the LIVE project. Run the test against the development project only.');
  process.exit(1);
}

const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, secretKey, options); // bypasses row-level security
const anon = createClient(url, publishableKey, options);

const run = Date.now().toString(36).toUpperCase();
const password = `Test-${randomUUID()}`;
const created = { users: [], codes: [], files: [] };
let failures = 0;

function check(name, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || detail === undefined ? '' : `  → ${JSON.stringify(detail)}`}`);
  if (!ok) failures++;
}

async function createUser(key, metadata = {}) {
  const email = `rls-test-${key}-${run.toLowerCase()}@example.com`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: `Test ${key}`, school_name: 'SD Test', ...metadata },
  });
  if (error) throw error;
  created.users.push(data.user.id);
  const client = createClient(url, publishableKey, options);
  const signIn = await client.auth.signInWithPassword({ email, password });
  if (signIn.error) throw signIn.error;
  return { id: data.user.id, email, client };
}

async function createCode(suffix, fields = {}) {
  const code = `T${run}-${suffix}`;
  const { data, error } = await admin.from('invite_codes').insert({ code, label: `RLS test ${suffix}`, ...fields }).select().single();
  if (error) throw error;
  created.codes.push(data.id);
  return code;
}

async function cleanUp() {
  for (const path of created.files) await admin.storage.from('teacher-files').remove([path]);
  for (const id of created.users) await admin.auth.admin.deleteUser(id);
  if (created.codes.length) await admin.from('invite_codes').delete().in('id', created.codes);
}

async function main() {
  // ── Setup ──
  const a = await createUser('a', { school_npsn: '12345678', phone: '0812 3456 7890', locale: 'en' });
  const b = await createUser('b', { school_npsn: 'not-a-number' });
  const boss = await createUser('admin');
  await admin.from('profiles').update({ role: 'admin' }).eq('id', boss.id);

  const okCode = await createCode('OK', { max_uses: 1 });
  const expiredCode = await createCode('EXPIRED', { expires_at: new Date(Date.now() - 86_400_000).toISOString() });
  const offCode = await createCode('OFF', { active: false });
  const signupCode = await createCode('SIGNUP');

  const filePath = `rls-test/${run}.pdf`;
  const upload = await admin.storage
    .from('teacher-files')
    .upload(filePath, new Blob(['%PDF-1.4 test'], { type: 'application/pdf' }), { contentType: 'application/pdf' });
  if (upload.error) throw upload.error;
  created.files.push(filePath);

  // ── Profiles ──
  let r = await a.client.from('profiles').select('*');
  check('teacher sees exactly one profile (own)', r.data?.length === 1 && r.data[0].id === a.id, r);
  const p = r.data?.[0];
  check('sign-up form copied into profile', p?.school_npsn === '12345678' && p?.phone === '0812 3456 7890' && p?.locale === 'en', p);
  r = await b.client.from('profiles').select('school_npsn').single();
  check('invalid NPSN dropped instead of blocking sign-up', r.data?.school_npsn === null, r);
  r = await a.client.from('profiles').update({ full_name: 'Teacher A' }).eq('id', a.id).select();
  check('teacher can edit own name', r.data?.[0]?.full_name === 'Teacher A', r);
  check('new account gets an animal avatar', typeof p?.avatar === 'string' && p.avatar.length > 0, p?.avatar);
  r = await a.client.from('profiles').update({ avatar: 'octopus' }).eq('id', a.id).select('avatar');
  check('teacher can choose an avatar', r.data?.[0]?.avatar === 'octopus', r);
  r = await a.client.from('profiles').update({ avatar: 'unicorn' }).eq('id', a.id);
  check('unknown avatar rejected', !!r.error, r);
  r = await a.client.from('profiles').update({ avatar: 'bear' }).eq('id', b.id).select();
  check("teacher cannot change someone else's avatar", (r.data?.length ?? 0) === 0, r);
  r = await a.client.from('profiles').update({ role: 'admin' }).eq('id', a.id);
  check('teacher cannot make themselves admin', !!r.error, r);
  r = await a.client.from('profiles').update({ verified_at: new Date().toISOString() }).eq('id', a.id);
  check('teacher cannot verify themselves', !!r.error, r);
  r = await a.client.from('profiles').update({ full_name: 'Hacked' }).eq('id', b.id).select();
  check("teacher cannot edit someone else's profile", (r.data?.length ?? 0) === 0, r);
  r = await anon.from('profiles').select('*');
  check('visitor cannot read profiles', !!r.error || r.data?.length === 0, r);
  r = await boss.client.from('profiles').select('id');
  check('admin can read all profiles', (r.data?.length ?? 0) >= 3, r);

  // ── Invite codes ──
  r = await a.client.from('invite_codes').select('*');
  check('teacher cannot read invite codes', !!r.error || r.data?.length === 0, r);
  r = await a.client.from('invite_codes').insert({ code: `T${run}-HACK`, label: 'x' });
  check('teacher cannot create invite codes', !!r.error, r);
  r = await boss.client.from('invite_codes').select('code').in('id', created.codes);
  check('admin can read invite codes', r.data?.length === created.codes.length, r);

  let file = await a.client.storage.from('teacher-files').createSignedUrl(filePath, 60);
  check('unverified teacher cannot get a teacher file', !!file.error, file);

  r = await a.client.rpc('redeem_invite_code', { p_code: expiredCode });
  check('expired code → "expired"', r.data === 'expired', r);
  r = await a.client.rpc('redeem_invite_code', { p_code: offCode });
  check('switched-off code → "not_found"', r.data === 'not_found', r);
  r = await a.client.rpc('redeem_invite_code', { p_code: ` ${okCode.toLowerCase()} ` });
  check('valid code (any case, spaces) → "ok"', r.data === 'ok', r);
  r = await a.client.from('profiles').select('verified_at').single();
  check('teacher is now verified', !!r.data?.verified_at, r);
  r = await a.client.rpc('redeem_invite_code', { p_code: okCode });
  check('second code → "already_verified"', r.data === 'already_verified', r);
  r = await b.client.rpc('redeem_invite_code', { p_code: okCode });
  check('code past its maximum uses → "used_up"', r.data === 'used_up', r);
  for (let i = 0; i < 4; i++) await b.client.rpc('redeem_invite_code', { p_code: `WRONG-${i}` });
  r = await b.client.rpc('redeem_invite_code', { p_code: signupCode });
  check('6th try within an hour → "too_many_attempts"', r.data === 'too_many_attempts', r);
  r = await anon.rpc('redeem_invite_code', { p_code: signupCode });
  check('visitor cannot redeem codes', !!r.error, r);

  const viaSignup = await createUser('signup', { invite_code: signupCode });
  r = await viaSignup.client.from('profiles').select('verified_at').single();
  check('code entered at registration verifies the teacher', !!r.data?.verified_at, r);

  // ── Teacher files ──
  file = await a.client.storage.from('teacher-files').createSignedUrl(filePath, 60);
  check('verified teacher gets a signed link', !!file.data?.signedUrl, file);
  if (file.data?.signedUrl) {
    const res = await fetch(file.data.signedUrl);
    check('signed link downloads the file', res.ok, res.status);
  }
  file = await b.client.storage.from('teacher-files').createSignedUrl(filePath, 60);
  check('unverified teacher still cannot get it', !!file.error, file);
  file = await anon.storage.from('teacher-files').createSignedUrl(filePath, 60);
  check('visitor cannot get it', !!file.error, file);
  r = await a.client.storage.from('teacher-files').upload(`rls-test/${run}-hack.pdf`, new Blob(['x']), { contentType: 'application/pdf' });
  if (!r.error) created.files.push(`rls-test/${run}-hack.pdf`);
  check('teacher cannot upload teacher files', !!r.error, r);

  // ── Saved resources and progress ──
  r = await a.client.from('saved_resources').insert({ resource_slug: 'lesson-plan-climate' });
  check('teacher can save a resource', !r.error, r);
  r = await a.client.from('saved_resources').insert({ resource_slug: 'Not A Slug!' });
  check('invalid slug rejected', !!r.error, r);
  r = await b.client.from('saved_resources').select('*');
  check("teacher cannot see someone else's saved items", r.data?.length === 0, r);
  r = await b.client.from('saved_resources').insert({ user_id: a.id, resource_slug: 'test-climate' });
  check('teacher cannot save for someone else', !!r.error, r);
  r = await a.client.from('progress').insert({ kind: 'theme_visited', item_slug: 'climate' });
  check('teacher can record progress', !r.error, r);
  r = await b.client.from('progress').select('*');
  check("teacher cannot see someone else's progress", r.data?.length === 0, r);
  r = await anon.from('saved_resources').insert({ user_id: a.id, resource_slug: 'test-climate' });
  check('visitor cannot write saved items', !!r.error, r);

  // ── Feedback votes ──
  const browserId = randomUUID();
  r = await anon.rpc('cast_vote', { p_resource: 'lesson-plan-climate', p_voter: browserId, p_vote: 'up' });
  check('visitor can vote', !r.error, r);
  r = await anon.rpc('cast_vote', { p_resource: 'lesson-plan-climate', p_voter: browserId, p_vote: 'down' });
  check('visitor can change their vote', !r.error, r);
  r = await a.client.rpc('cast_vote', { p_resource: 'lesson-plan-climate', p_voter: randomUUID(), p_vote: 'up' });
  check('teacher can vote', !r.error, r);
  r = await anon.from('feedback_votes').select('*');
  check('visitor cannot read votes directly', !!r.error || r.data?.length === 0, r);
  r = await a.client.rpc('feedback_totals');
  check('teacher cannot read vote totals', !!r.error, r);
  r = await boss.client.rpc('feedback_totals');
  const row = r.data?.find((t) => t.resource_slug === 'lesson-plan-climate');
  check('admin reads vote totals', row !== undefined && Number(row.up) >= 1 && Number(row.down) >= 1, r);
  await anon.rpc('cast_vote', { p_resource: 'lesson-plan-climate', p_voter: browserId, p_vote: null });
  await a.client.rpc('cast_vote', { p_resource: 'lesson-plan-climate', p_voter: a.id, p_vote: null });

  // ── Personal data, keep-alive ──
  r = await a.client.rpc('export_my_data');
  check('export contains e-mail, profile, saved items and progress',
    r.data?.email === a.email && r.data?.profile?.id === a.id && r.data?.saved_resources?.length === 1 && r.data?.progress?.length === 1, r);
  r = await anon.rpc('ping');
  check('ping answers for visitors', r.data === 'ok', r);
  r = await b.client.rpc('delete_my_account');
  check('teacher can delete their account', !r.error, r);
  const gone = await admin.auth.admin.getUserById(b.id);
  check('deleted account is gone', !!gone.error || !gone.data?.user, gone.data);
  r = await admin.from('profiles').select('id').eq('id', b.id);
  check('its profile is gone too', r.data?.length === 0, r);
}

try {
  await main();
} catch (error) {
  console.error('Test setup failed:', error);
  failures++;
} finally {
  await cleanUp();
}
console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
