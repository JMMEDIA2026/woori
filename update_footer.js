import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /<footer className="border-t py-12 px-4 transition-all bg-stone-100 border-stone-200 text-stone-600">[\s\S]*?(?=<\/div>\s*<\/div>\s*\);)/m;

const replacement = `<footer className="border-t border-stone-200 py-20 px-6 transition-all bg-white text-stone-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Logo brand */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 bg-stone-900 flex items-center justify-center text-white font-black text-2xl">
                N.S
              </div>
              <div className="flex flex-col">
                <p className="font-black text-2xl tracking-tight text-stone-900">
                  {branding.orgName}
                </p>
                <p className="text-[10px] tracking-[0.25em] mt-0.5 text-stone-400 font-bold uppercase">
                  {branding.slogan}
                </p>
              </div>
            </div>
            <p className="text-base leading-relaxed max-w-sm font-light">
              탈북민의 권익 신장, 시니어 단원 1:1 동료 치유 멘토링, MBJK 메아리
              예술단 가동 및 사단법인 탈북민공익활동지원연합을 가동하는 충남
              아산 거점 연합체입니다.
            </p>
          </div>
          
          {/* Registration Details columns */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h4 className="font-bold text-lg text-stone-900 uppercase tracking-widest">
              기관 인가 공직 신고 사항
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-light text-base text-stone-500">
              <p>충청남도 비영리 등록: 제1540호</p>
              <p>기부금 공익 대상 지정: 행안부 등기</p>
              <p>주무 관청 인가: 통일부 소관사단</p>
              <p>대표권 소유: 채신아 이사장</p>
              <p>상임 행정 총괄: 이은택 사무총장</p>
              <p>내외 전무 감사: 실무위원회</p>
            </div>
          </div>
          
          {/* Contact Details Column */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="font-bold text-lg text-stone-900 uppercase tracking-widest">
              상설 사무처
            </h4>
            <div className="space-y-3 font-light text-base text-stone-500">
              <p className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-700 opacity-80" />
                <span>충청남도 아산시 충무로 & 아산로</span>
              </p>
              <p className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-amber-700 opacity-80" />
                <span>041-000-0000</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-700 opacity-80" />
                <span>woorione@example.com</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light">
          <p>© {new Date().getFullYear()} {branding.orgName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-stone-900 transition-colors">이용약관</button>
            <button className="hover:text-stone-900 transition-colors">개인정보처리방침</button>
            <button className="hover:text-stone-900 transition-colors">이메일무단수집거부</button>
          </div>
        </div>
      </footer>`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code);
