# 내 전화

나만 쓰는 인터넷 전화와 문자. Cloudflare Worker + D1 + Twilio.

- **문자 받기**: 내 번호로 온 문자가 웹 화면에 저장되어 보입니다.
- **문자 보내기**: 웹 화면에서 내 번호로 문자를 보냅니다.
- **전화 받기/걸기**: 브라우저가 전화기가 됩니다. 걸려온 전화는 브라우저에서 받고, 일반 번호로 걸 수 있습니다.
- 비밀번호 로그인(한 명 전용). 모든 Twilio 웹훅은 서명을 검증합니다.

## 한계 (먼저 읽어 주세요)
- 전화는 **웹페이지를 열어 둔 동안에만** 울립니다. 닫혀 있으면 상대에게 "지금은 받을 수 없습니다" 안내가 나갑니다.
- 미국 번호로 문자를 **보내려면** Twilio의 A2P 10DLC 등록이 필요할 수 있습니다. 받는 것은 등록 없이 됩니다.
- 한국 등 해외로 전화·문자를 걸려면 Twilio 콘솔의 Voice/Messaging **Geo Permissions**에서 해당 국가를 허용해야 합니다.
- 번호 월 요금, 통화 분당 요금, 문자 건당 요금이 Twilio에서 청구됩니다.

## 1. Twilio 준비
1. Twilio 계정을 만들고 번호를 하나 구매합니다(음성·문자 가능한 번호).
2. **API Key** 생성: Console → Account → API keys → Create (SID `SK...`와 Secret 저장).
3. **TwiML App** 생성: Console → Voice → TwiML Apps → Create. **Voice Request URL**에 `https://<워커주소>/twilio/voice` (POST).
4. 구매한 번호 설정(Phone Numbers → Active numbers → 번호 선택):
   - Voice: *A call comes in* → Webhook, `https://<워커주소>/twilio/voice`, POST
   - Messaging: *A message comes in* → Webhook, `https://<워커주소>/twilio/sms`, POST

`<워커주소>`는 예: `woorione-hyperdrive-api.<계정>.workers.dev`

## 2. 비밀값 등록 (Cloudflare)
Cloudflare 대시보드 → Workers & Pages → 이 Worker → Settings → Variables and Secrets 에서 **Secret**으로 추가하거나, 터미널에서 하나씩 입력합니다.

```bash
npx wrangler secret put APP_PASSWORD
npx wrangler secret put SESSION_SECRET
npx wrangler secret put TWILIO_ACCOUNT_SID
npx wrangler secret put TWILIO_AUTH_TOKEN
npx wrangler secret put TWILIO_API_KEY_SID
npx wrangler secret put TWILIO_API_KEY_SECRET
npx wrangler secret put TWILIO_TWIML_APP_SID
npx wrangler secret put TWILIO_NUMBER
```

- `APP_PASSWORD`: 로그인 비밀번호(길고 무작위로)
- `SESSION_SECRET`: 아무 긴 무작위 문자열
- `TWILIO_NUMBER`: `+1…` 형식의 구매한 번호
- 비밀값은 채팅이나 코드에 적지 마세요.

## 3. 배포
`main`에 병합하면 Git 연동 배포가 실행됩니다. 수동 배포는 `npm run deploy`.

D1 데이터베이스(`phone-db`)는 `wrangler.jsonc`에 id 없이 선언되어 있어 배포 때 자동 생성됩니다. 자동 생성이 안 되면 직접 만들고 id를 넣으세요.

```bash
npx wrangler d1 create phone-db
```

출력된 `database_id`를 `wrangler.jsonc`의 `d1_databases` 항목에 추가합니다. 표는 처음 요청 때 자동으로 만들어집니다.

## 로컬 점검
`.dev.vars`(gitignore됨)에 위 이름들로 가짜 값을 넣고 `npx wrangler dev`, 다른 터미널에서 `node scripts/smoke-test.mjs`.
