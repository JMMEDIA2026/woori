import React from "react";
import { Heart, Gift, CreditCard, CheckCircle2 } from "lucide-react";

export default function DigitalFundraising() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-6xl font-black text-slate-900 drop-shadow-sm mb-4">정기 후원 안내</h2>
        <p className="text-slate-500 font-medium">여러분의 소중한 나눔이 탈북민의 든든한 자립 기반이 됩니다.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 p-32 bg-slate-50/50 blur-[80px] rounded-full pointer-events-none"></div>
         <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-rose-50 to-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-md border border-slate-100 rotate-3">
            <Heart className="w-12 h-12 text-blue-600 -rotate-3 drop-shadow-md" />
         </div>
         <h3 className="relative z-10 text-5xl font-black text-slate-900 mb-6 tracking-tight">따뜻한 마음 나누기</h3>
         <p className="relative z-10 text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
            정기 후원금은 치유 상담실 운영, 수공예 공방 재료 지원, 메아리 예술단 활동 등 탈북민의 정서적, 경제적 자립을 돕는 모든 사업에 투명하게 전액 사용됩니다.<br/>
            우리원은 지정기부금 단체로, 후원해주신 금액에 대해 기부금 영수증이 발급됩니다.
         </p>

         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10 text-left">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-indigo-200 transition-all duration-500 group">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors border border-indigo-100 text-indigo-500"><CreditCard className="w-5 h-5" /></div> 계좌이체 후원
              </h4>
              <p className="text-4xl font-black text-indigo-600 mb-1">농협 301-0251-8906-41</p>
              <p className="text-xl text-slate-500 font-bold">예금주: 비영리민간단체 우리원</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-blue-200 transition-all duration-500 group">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors border border-blue-100 text-blue-500"><Gift className="w-5 h-5" /></div> 물품 후원 및 CMS
              </h4>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                정기 CMS 자동이체 및 생활용품, 식자재 등 물품 후원을 원하시는 분은 사무처로 문의 바랍니다.<br/>
                <span className="font-black text-blue-600 mt-2 inline-block text-3xl">문의: 041-543-9060</span>
              </p>
            </div>
         </div>

         <div className="relative z-10 bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-[2rem] text-left flex flex-col md:flex-row gap-5 max-w-3xl mx-auto items-start md:items-center">
            <CheckCircle2 className="w-8 h-8 text-blue-600 shrink-0" />
            <div>
               <h4 className="font-black text-rose-900 mb-2">기부금 영수증 발급 안내</h4>
               <p className="text-xl text-rose-700/90 leading-relaxed font-medium">
                 기부금 영수증 발급을 위해서는 후원자님의 성함과 주민등록번호가 필요합니다. 송금 후 사무처로 연락 주시거나, 홈페이지의 문의 게시판에 내용을 남겨주시면 감사하겠습니다. 국세청 연말정산 간소화 서비스에서 조회 가능합니다.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
