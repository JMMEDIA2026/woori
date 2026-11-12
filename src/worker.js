// 나만의 인터넷 전화: Cloudflare Worker + D1 + Twilio (문자 수신/발신, 브라우저 전화기)
const enc = new TextEncoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const b64url = (buf) => b64(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlStr = (s) => b64url(enc.encode(s));

async function hmac(hash, key, data) {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash }, false, ['sign']);
  return crypto.subtle.sign('HMAC', k, enc.encode(data));
}
function safeEqual(a, b) {
  a = enc.encode(String(a)); b = enc.encode(String(b));
  let d = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) d |= (a[i] || 0) ^ (b[i] || 0);
  return d === 0;
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const E164 = /^\+[1-9]\d{6,14}$/;

const BASE_HEADERS = { 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' };
const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { ...BASE_HEADERS, 'Content-Type': 'application/json; charset=utf-8', ...extra } });
const twiml = (inner) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`, { headers: { ...BASE_HEADERS, 'Content-Type': 'text/xml; charset=utf-8' } });

/* ---------- 설정 점검 ---------- */
const AUTH_KEYS = ['APP_PASSWORD', 'SESSION_SECRET'];
const TWILIO_KEYS = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_API_KEY_SID', 'TWILIO_API_KEY_SECRET', 'TWILIO_TWIML_APP_SID', 'TWILIO_NUMBER'];
const missing = (env, keys) => keys.filter((k) => !env[k]);

/* ---------- DB ---------- */
let schemaReady;
function ensureSchema(env) {
  schemaReady ||= env.DB.batch([
    env.DB.prepare('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, sid TEXT UNIQUE, direction TEXT NOT NULL, peer TEXT NOT NULL, body TEXT NOT NULL, ts INTEGER NOT NULL)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages (ts)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS calls (id INTEGER PRIMARY KEY AUTOINCREMENT, sid TEXT UNIQUE, direction TEXT NOT NULL, peer TEXT NOT NULL, status TEXT, ts INTEGER NOT NULL)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_calls_ts ON calls (ts)')
  ]).catch((e) => { schemaReady = undefined; throw e; });
  return schemaReady;
}

/* ---------- 로그인 세션 ---------- */
async function makeSession(env) {
  const exp = Math.floor(Date.now() / 1000) + 7 * 86400;
  return `${exp}.${b64url(await hmac('SHA-256', env.SESSION_SECRET, 'sess.' + exp))}`;
}
async function hasSession(request, env) {
  const m = /(?:^|;\s*)sid=([^;]+)/.exec(request.headers.get('Cookie') || '');
  if (!m || !env.SESSION_SECRET) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, b64url(await hmac('SHA-256', env.SESSION_SECRET, 'sess.' + exp)));
}

/* ---------- Twilio ---------- */
async function validTwilio(request, env, params) {
  const sig = request.headers.get('X-Twilio-Signature');
  if (!sig || !env.TWILIO_AUTH_TOKEN) return false;
  let data = request.url;
  for (const k of Object.keys(params).sort()) data += k + params[k];
  return safeEqual(sig, b64(await hmac('SHA-1', env.TWILIO_AUTH_TOKEN, data)));
}
async function voiceToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64urlStr(JSON.stringify({ alg: 'HS256', typ: 'JWT', cty: 'twilio-fpa;v=1' }));
  const body = b64urlStr(JSON.stringify({
    jti: `${env.TWILIO_API_KEY_SID}-${now}`, iss: env.TWILIO_API_KEY_SID, sub: env.TWILIO_ACCOUNT_SID, iat: now, exp: now + 3600,
    grants: { identity: 'me', voice: { incoming: { allow: true }, outgoing: { application_sid: env.TWILIO_TWIML_APP_SID } } }
  }));
  return `${head}.${body}.${b64url(await hmac('SHA-256', env.TWILIO_API_KEY_SECRET, `${head}.${body}`))}`;
}

/* ---------- 요청 처리 ---------- */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    try {
      if (p.startsWith('/twilio/')) return await twilioRoutes(request, env, p);
      if (p.startsWith('/api/')) return await apiRoutes(request, env, p, url);
    } catch (e) {
      console.error(p, e && e.message);
      return json({ error: '서버 오류가 발생했습니다.' }, 500);
    }
    return env.ASSETS.fetch(request);
  }
};

async function twilioRoutes(request, env, p) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const params = Object.fromEntries(await request.formData());
  if (!(await validTwilio(request, env, params))) return new Response('Forbidden', { status: 403 });
  await ensureSchema(env);
  const now = Math.floor(Date.now() / 1000);

  if (p === '/twilio/sms') {
    await env.DB.prepare('INSERT OR IGNORE INTO messages (sid, direction, peer, body, ts) VALUES (?, ?, ?, ?, ?)')
      .bind(params.MessageSid || null, 'in', params.From || '알 수 없음', params.Body || '', now).run();
    return twiml('');
  }

  if (p === '/twilio/voice') {
    const from = params.From || '';
    if (from.startsWith('client:')) { // 브라우저 전화기에서 거는 전화
      const to = String(params.To || '').replace(/[\s-]/g, '');
      if (!E164.test(to)) return twiml('<Say language="ko-KR">전화번호 형식이 올바르지 않습니다.</Say>');
      await env.DB.prepare('INSERT OR IGNORE INTO calls (sid, direction, peer, status, ts) VALUES (?, ?, ?, ?, ?)')
        .bind(params.CallSid || null, 'out', to, 'dialing', now).run();
      return twiml(`<Dial callerId="${esc(env.TWILIO_NUMBER)}" answerOnBridge="true"><Number>${esc(to)}</Number></Dial>`);
    }
    await env.DB.prepare('INSERT OR IGNORE INTO calls (sid, direction, peer, status, ts) VALUES (?, ?, ?, ?, ?)')
      .bind(params.CallSid || null, 'in', from || '알 수 없음', 'ringing', now).run();
    return twiml('<Dial timeout="25" answerOnBridge="true" action="/twilio/dial-done"><Client>me</Client></Dial>');
  }

  if (p === '/twilio/dial-done') {
    const status = params.DialCallStatus || 'unknown';
    await env.DB.prepare('UPDATE calls SET status = ? WHERE sid = ?').bind(status, params.CallSid || '').run();
    return status === 'completed' ? twiml('') : twiml('<Say language="ko-KR">지금은 전화를 받을 수 없습니다. 나중에 다시 걸어 주세요.</Say>');
  }
  return new Response('Not Found', { status: 404 });
}

async function apiRoutes(request, env, p, url) {
  if (p === '/api/login' && request.method === 'POST') {
    const bad = missing(env, AUTH_KEYS);
    if (bad.length) return json({ error: '서버 설정이 끝나지 않았습니다.', missing: bad }, 503);
    const ok = await readJson(request).then((b) => b && typeof b.password === 'string' && safeEqual(b.password, env.APP_PASSWORD));
    if (!ok) { await new Promise((r) => setTimeout(r, 800)); return json({ error: '비밀번호가 맞지 않습니다.' }, 401); }
    const cookie = `sid=${await makeSession(env)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;
    return json({ ok: true }, 200, { 'Set-Cookie': cookie });
  }
  if (p === '/api/logout' && request.method === 'POST') return json({ ok: true }, 200, { 'Set-Cookie': 'sid=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0' });

  if (!(await hasSession(request, env))) return json({ error: '로그인이 필요합니다.' }, 401);
  if (request.method !== 'GET') {
    if (!(request.headers.get('Content-Type') || '').includes('application/json') || request.headers.get('Sec-Fetch-Site') === 'cross-site')
      return json({ error: '잘못된 요청입니다.' }, 400);
  }
  await ensureSchema(env);

  if (p === '/api/me') return json({ number: env.TWILIO_NUMBER || null, missing: missing(env, TWILIO_KEYS) });

  const need = missing(env, TWILIO_KEYS);
  if (need.length && (p === '/api/token' || p === '/api/sms')) return json({ error: 'Twilio 설정이 끝나지 않았습니다.', missing: need }, 503);

  if (p === '/api/token' && request.method === 'GET') return json({ token: await voiceToken(env) });

  if (p === '/api/messages' && request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT id, direction, peer, body, ts FROM messages ORDER BY ts DESC, id DESC LIMIT 300').all();
    return json({ messages: results });
  }
  if (p === '/api/calls' && request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT id, direction, peer, status, ts FROM calls ORDER BY ts DESC, id DESC LIMIT 100').all();
    return json({ calls: results });
  }

  if (p === '/api/sms' && request.method === 'POST') {
    const b = await readJson(request);
    const to = String(b?.to || '').replace(/[\s-]/g, '');
    const body = String(b?.body || '');
    if (!E164.test(to)) return json({ error: '받는 번호를 +국가번호 형식으로 입력해 주세요. 예: +821012345678' }, 400);
    if (!body.trim() || body.length > 1600) return json({ error: '문자 내용은 1자 이상 1600자 이하여야 합니다.' }, 400);
    let res;
    try {
      res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: { Authorization: 'Basic ' + btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`), 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ To: to, From: env.TWILIO_NUMBER, Body: body })
      });
    } catch {
      return json({ error: 'Twilio 서버에 연결하지 못했습니다. 잠시 뒤 다시 시도해 주세요.' }, 502);
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return json({ error: `Twilio가 문자 발송을 거절했습니다: ${data.message || res.status}` }, 502);
    await env.DB.prepare('INSERT OR IGNORE INTO messages (sid, direction, peer, body, ts) VALUES (?, ?, ?, ?, ?)')
      .bind(data.sid || null, 'out', to, body, Math.floor(Date.now() / 1000)).run();
    return json({ ok: true });
  }
  return json({ error: '찾을 수 없습니다.' }, 404);
}

async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}
