// 로컬 점검용: .dev.vars(가짜 값)로 `npx wrangler dev --port 8788` 실행 후 `node scripts/smoke-test.mjs`
import crypto from 'node:crypto';
const B='http://localhost:8788', TOKEN='test-auth-token';
const sign=(url,p)=>crypto.createHmac('sha1',TOKEN).update(url+Object.keys(p).sort().map(k=>k+p[k]).join('')).digest('base64');
const form=(p)=>new URLSearchParams(p);
let pass=0,fail=0; const ok=(n,c,x='')=>{c?pass++:fail++;console.log((c?'PASS ':'FAIL ')+n+(c?'':'  '+x));};
async function hook(path,p,signed=true){return fetch(B+path,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded',...(signed?{'X-Twilio-Signature':sign(B+path,p)}:{})},body:form(p)});}

// 1 인증
let r=await fetch(B+'/api/messages'); ok('로그인 없이 /api/messages 거부',r.status===401);
r=await fetch(B+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:'wrong'})}); ok('틀린 비밀번호 거부',r.status===401);
r=await fetch(B+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:'test-pass-123'})});
const sid=(r.headers.get('set-cookie')||'').match(/sid=[^;]+/)?.[0]; ok('올바른 비밀번호 로그인+쿠키',r.status===200&&!!sid);
const H={Cookie:sid,'Content-Type':'application/json'};
// 2 문자 수신
let p={MessageSid:'SM1',From:'+821012345678',To:'+15550001111',Body:'인증번호 482913 입니다'};
r=await hook('/twilio/sms',p,false); ok('서명 없는 문자 웹훅 거부(403)',r.status===403);
r=await fetch(B+'/twilio/sms',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','X-Twilio-Signature':'AAAA'},body:form(p)}); ok('틀린 서명 거부(403)',r.status===403);
r=await hook('/twilio/sms',p); ok('올바른 서명 문자 수신(200)',r.status===200,await r.clone().text());
await hook('/twilio/sms',p); // 재전송(중복)
r=await fetch(B+'/api/messages',{headers:H}); let d=await r.json();
ok('수신 문자가 저장되고 중복 없음',d.messages.length===1&&d.messages[0].body.includes('482913')&&d.messages[0].direction==='in',JSON.stringify(d));
// 3 전화 웹훅
p={CallSid:'CA1',From:'+821099998888',To:'+15550001111'};
r=await hook('/twilio/voice',p); let t=await r.text(); ok('걸려온 전화 → 브라우저 호출 TwiML',r.status===200&&t.includes('<Client>me</Client>')&&t.includes('/twilio/dial-done'),t);
p={CallSid:'CA2',From:'client:me',To:'+821012345678'};
r=await hook('/twilio/voice',p); t=await r.text(); ok('브라우저 발신 → 번호로 연결 TwiML',t.includes('<Number>+821012345678</Number>')&&t.includes('callerId="+15550001111"'),t);
p={CallSid:'CA3',From:'client:me',To:'+82"><Hack/>'};
r=await hook('/twilio/voice',p); t=await r.text(); ok('이상한 번호 차단(XML 주입 방지)',!t.includes('<Hack/>')&&t.includes('<Say'),t);
p={CallSid:'CA1',DialCallStatus:'no-answer'};
r=await hook('/twilio/dial-done',p); t=await r.text(); ok('부재중 안내 멘트',t.includes('<Say'),t);
r=await fetch(B+'/api/calls',{headers:H}); d=await r.json(); ok('통화 기록 저장(2건, 이상한 번호는 기록 안 함)',d.calls.length===2&&d.calls.some(c=>c.status==='no-answer'),JSON.stringify(d));
// 4 토큰
r=await fetch(B+'/api/token',{headers:H}); d=await r.json(); const [h,b,s]=d.token.split('.');
const exp=crypto.createHmac('sha256','test-api-secret').update(h+'.'+b).digest('base64url'); const pl=JSON.parse(Buffer.from(b,'base64url'));
ok('음성 토큰 서명 일치',s===exp); ok('토큰 내용(identity/앱SID/수신허용)',pl.iss==='SKtest00000000000000000000000000'&&pl.sub.startsWith('ACtest')&&pl.grants.identity==='me'&&pl.grants.voice.incoming.allow&&pl.grants.voice.outgoing.application_sid.startsWith('APtest'),JSON.stringify(pl));
// 5 문자 발송 검증
r=await fetch(B+'/api/sms',{method:'POST',headers:H,body:JSON.stringify({to:'abc',body:'x'})}); ok('잘못된 번호 형식 400',r.status===400);
r=await fetch(B+'/api/sms',{method:'POST',headers:{Cookie:sid},body:'{}'}); ok('JSON 아닌 POST 거부(CSRF 방어)',r.status===400);
r=await fetch(B+'/api/sms',{method:'POST',headers:H,body:JSON.stringify({to:'+821012345678',body:'테스트'})}); ok('가짜 키로 발송 시 Twilio 거절을 502로 전달',r.status===502,r.status+' '+await r.text());
// 6 정적 파일
for (const f of ['/','/app.js','/style.css','/vendor/twilio.min.js']){r=await fetch(B+f);ok('정적 '+f,r.status===200);}
r=await fetch(B+'/'); ok('CSP 헤더',(r.headers.get('content-security-policy')||'').includes("script-src 'self'"));
console.log(`\n${pass} 통과 / ${fail} 실패`);
