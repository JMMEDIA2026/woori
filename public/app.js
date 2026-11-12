(function () {
  var $ = function (id) { return document.getElementById(id); };
  var state = { peer: null, messages: [], calls: [], number: '', voiceReady: false };
  var device = null, activeCall = null, incomingCall = null, timer = null;

  function api(path, opts) {
    opts = opts || {};
    var init = { method: opts.method || 'GET', credentials: 'same-origin', headers: {} };
    if (opts.body !== undefined) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(opts.body); }
    return fetch(path, init).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (r.status === 401 && path !== '/api/login') { showLogin(); throw new Error('로그인이 필요합니다.'); }
        if (!r.ok) { var e = new Error(d.error || '요청에 실패했습니다.'); e.data = d; throw e; }
        return d;
      });
    });
  }
  function fmtTime(ts) {
    var d = new Date(ts * 1000), n = new Date(), p = function (x) { return String(x).padStart(2, '0'); };
    var t = p(d.getHours()) + ':' + p(d.getMinutes());
    return d.toDateString() === n.toDateString() ? t : (d.getMonth() + 1) + '/' + d.getDate() + ' ' + t;
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

  /* ----- 로그인 ----- */
  function showLogin() { stopAll(); $('app').hidden = true; $('login').hidden = false; $('pw').focus(); }
  function showApp() { $('login').hidden = true; $('app').hidden = false; }
  $('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); $('loginErr').textContent = '';
    api('/api/login', { method: 'POST', body: { password: $('pw').value } })
      .then(function () { $('pw').value = ''; start(); })
      .catch(function (err) {
        var m = err.data && err.data.missing ? ' (설정 필요: ' + err.data.missing.join(', ') + ')' : '';
        $('loginErr').textContent = err.message + m;
      });
  });
  $('logout').addEventListener('click', function () { api('/api/logout', { method: 'POST', body: {} }).finally(showLogin); });

  /* ----- 탭 ----- */
  document.querySelectorAll('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.tabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('on', t.id === 'tab-' + b.dataset.tab); });
    });
  });

  /* ----- 문자 ----- */
  function groups() {
    var map = {}, order = [];
    state.messages.forEach(function (m) { if (!map[m.peer]) { map[m.peer] = []; order.push(m.peer); } map[m.peer].push(m); });
    return { map: map, order: order };
  }
  function renderConvs() {
    var g = groups(), ul = $('convs'); ul.textContent = '';
    g.order.forEach(function (peer) {
      var last = g.map[peer][0], li = el('li'), b = el('button'); b.type = 'button';
      var top = el('div', 'row between'); top.appendChild(el('span', 'peer', peer)); top.appendChild(el('span', 'muted small', fmtTime(last.ts)));
      b.appendChild(top); b.appendChild(el('span', 'snip', (last.direction === 'out' ? '나: ' : '') + last.body));
      b.addEventListener('click', function () { openThread(peer, false); });
      li.appendChild(b); ul.appendChild(li);
    });
    $('convEmpty').hidden = g.order.length > 0;
  }
  function renderThread() {
    if (!state.peer) return;
    var box = $('bubbles'), atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 40; box.textContent = '';
    (groups().map[state.peer] || []).slice().reverse().forEach(function (m) {
      var b = el('div', 'bubble' + (m.direction === 'out' ? ' out' : ''), m.body); b.appendChild(el('time', '', fmtTime(m.ts))); box.appendChild(b);
    });
    if (atBottom) box.scrollTop = box.scrollHeight;
  }
  function openThread(peer, isNew) {
    state.peer = peer || ''; $('convList').hidden = true; $('thread').hidden = false;
    $('newTo').hidden = !isNew; $('threadPeer').textContent = isNew ? '새 문자' : peer; $('smsErr').textContent = '';
    renderThread(); if (isNew) $('toInput').focus(); else $('msgBody').focus();
    $('bubbles').scrollTop = $('bubbles').scrollHeight;
  }
  $('back').addEventListener('click', function () { state.peer = null; $('thread').hidden = true; $('convList').hidden = false; renderConvs(); });
  $('newMsg').addEventListener('click', function () { openThread('', true); });
  $('composer').addEventListener('submit', function (e) {
    e.preventDefault();
    var to = $('newTo').hidden ? state.peer : $('toInput').value.trim(), body = $('msgBody').value;
    if (!body.trim()) return;
    $('sendBtn').disabled = true; $('smsErr').textContent = '';
    api('/api/sms', { method: 'POST', body: { to: to, body: body } })
      .then(function () {
        $('msgBody').value = '';
        if (!$('newTo').hidden) { state.peer = to.replace(/[\s-]/g, ''); $('newTo').hidden = true; $('threadPeer').textContent = state.peer; }
        return loadMessages();
      })
      .catch(function (err) { $('smsErr').textContent = err.message; })
      .finally(function () { $('sendBtn').disabled = false; });
  });
  function loadMessages() { return api('/api/messages').then(function (d) { state.messages = d.messages; renderConvs(); renderThread(); }); }

  /* ----- 기록 ----- */
  var STATUS = { completed: '통화함', 'no-answer': '부재중', busy: '통화 중', failed: '실패', canceled: '취소', ringing: '벨 울림', dialing: '발신' };
  function loadCalls() {
    return api('/api/calls').then(function (d) {
      var ul = $('calls'); ul.textContent = '';
      d.calls.forEach(function (c) {
        var li = el('li', 'plain'); li.appendChild(el('span', 'mono', (c.direction === 'in' ? '수신 ' : '발신 ') + c.peer));
        li.appendChild(el('span', 'muted small', (STATUS[c.status] || c.status || '') + ' · ' + fmtTime(c.ts))); ul.appendChild(li);
      });
      $('callsEmpty').hidden = d.calls.length > 0;
    });
  }

  /* ----- 전화 ----- */
  '123456789*0#'.split('').forEach(function (k) {
    var b = el('button', '', k); b.type = 'button';
    b.addEventListener('click', function () { if (activeCall) activeCall.sendDigits(k); else $('dialInput').value += k; });
    $('pad').appendChild(b);
  });
  function setVoice(ok, text) { state.voiceReady = ok; $('voiceDot').className = 'dot ' + (ok ? 'on' : 'off'); $('voiceState').textContent = text; }
  function setCallUi(inCall, text) { $('callBtn').hidden = inCall; $('hangBtn').hidden = !inCall; $('callState').textContent = text || ''; }
  function bindCall(call) {
    activeCall = call;
    call.on('accept', function () { setCallUi(true, '통화 중'); });
    call.on('ringing', function () { setCallUi(true, '상대방을 호출하는 중…'); });
    call.on('disconnect', function () { activeCall = null; setCallUi(false, '통화가 끝났습니다.'); loadCalls(); });
    call.on('cancel', function () { activeCall = null; setCallUi(false, ''); });
    call.on('error', function (e) { setCallUi(false, '통화 오류: ' + (e.message || e.code)); });
  }
  $('callBtn').addEventListener('click', function () {
    var to = $('dialInput').value.replace(/[\s-]/g, '');
    if (!/^\+[1-9]\d{6,14}$/.test(to)) { $('callState').textContent = '번호를 +국가번호 형식으로 입력해 주세요. 예: +821012345678'; return; }
    if (!device) { $('callState').textContent = '전화 연결이 아직 준비되지 않았습니다.'; return; }
    setCallUi(true, '마이크 권한을 확인하는 중…');
    device.connect({ params: { To: to } }).then(bindCall).catch(function (e) { setCallUi(false, '전화를 걸지 못했습니다: ' + (e.message || e)); });
  });
  $('hangBtn').addEventListener('click', function () { if (activeCall) activeCall.disconnect(); });

  function initVoice() {
    if (!window.Twilio || !Twilio.Device) { setVoice(false, '전화 SDK 없음'); return; }
    api('/api/token').then(function (d) {
      device = new Twilio.Device(d.token, { codecPreferences: ['opus', 'pcmu'], closeProtection: true });
      device.on('registered', function () { state.voiceErr = false; setVoice(true, '전화 받을 수 있음'); });
      device.on('unregistered', function () { if (!state.voiceErr) setVoice(false, '전화 연결 끊김'); });
      device.on('error', function (e) { state.voiceErr = true; setVoice(false, '전화 오류: ' + ((e && (e.message || e.code)) || '알 수 없음')); });
      device.on('tokenWillExpire', function () { api('/api/token').then(function (t) { device.updateToken(t.token); }); });
      device.on('incoming', function (call) {
        incomingCall = call; $('incomingFrom').textContent = call.parameters.From || '알 수 없음'; $('incoming').hidden = false;
        call.on('cancel', function () { $('incoming').hidden = true; incomingCall = null; loadCalls(); });
        call.on('disconnect', function () { activeCall = null; setCallUi(false, '통화가 끝났습니다.'); loadCalls(); });
      });
      return device.register();
    }).catch(function (e) {
      var m = e && e.data && e.data.missing ? 'Twilio 설정 필요' : '전화 연결 실패';
      if (!state.voiceErr) setVoice(false, m);
    });
  }
  $('accept').addEventListener('click', function () {
    if (!incomingCall) return; var c = incomingCall; incomingCall = null; $('incoming').hidden = true;
    c.accept(); bindCall(c); document.querySelector('[data-tab=call]').click(); setCallUi(true, '통화 중');
  });
  $('reject').addEventListener('click', function () { if (incomingCall) { incomingCall.reject(); incomingCall = null; $('incoming').hidden = true; } });

  /* ----- 시작/종료 ----- */
  function stopAll() { if (timer) clearInterval(timer); timer = null; if (device) { try { device.destroy(); } catch (e) {} device = null; } }
  function start() {
    api('/api/me').then(function (me) {
      showApp(); state.number = me.number || '';
      $('myNumber').textContent = me.number || '번호가 설정되지 않았습니다';
      var n = $('setupNotice');
      if (me.missing && me.missing.length) { n.hidden = false; n.textContent = '아직 설정이 끝나지 않았습니다. 필요한 비밀값: ' + me.missing.join(', '); } else n.hidden = true;
      return Promise.all([loadMessages(), loadCalls()]);
    }).then(function () {
      initVoice();
      timer = setInterval(function () { if (!document.hidden) { loadMessages().catch(function () {}); loadCalls().catch(function () {}); } }, 5000);
    }).catch(function () {});
  }
  api('/api/me').then(start).catch(function () { showLogin(); });
})();
