import React from "react";
import { HandHeart, Send } from "lucide-react";

export default function CounselingShelter() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-stone-900 drop-shadow-sm mb-4">자원봉사 신청</h2>
        <p className="text-stone-500 font-medium">함께 나누는 땀방울이 큰 희망으로 피어납니다.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-amber-50/50 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="p-8 md:p-14 md:pb-10 relative z-10">
           <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
             <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-white rounded-2xl flex items-center justify-center text-amber-500 border border-amber-100 shadow-md shrink-0">
               <HandHeart className="w-8 h-8" />
             </div>
             <div>
               <h3 className="text-2xl font-black text-stone-900 mb-1">함께 만드는 변화, 봉사 참여</h3>
               <p className="text-sm font-medium text-stone-500">밑반찬 배달, 김장 나눔, 예술단 공연 보조 등 다양한 분야에서 활동하실 수 있습니다.</p>
             </div>
           </div>

           <form className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                 <label className="text-sm font-bold text-stone-700 ml-1">이름</label>
                 <input type="text" className="w-full px-5 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all shadow-inner font-medium text-stone-800" placeholder="홍길동" />
               </div>
               <div className="space-y-3">
                 <label className="text-sm font-bold text-stone-700 ml-1">연락처</label>
                 <input type="tel" className="w-full px-5 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all shadow-inner font-medium text-stone-800" placeholder="010-0000-0000" />
               </div>
             </div>
             
             <div className="space-y-3">
               <label className="text-sm font-bold text-stone-700 ml-1">희망 봉사 분야</label>
               <select className="w-full px-5 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all shadow-inner font-medium text-stone-800 appearance-none">
                 <option>밑반찬 및 김장 나눔 보조</option>
                 <option>수공예 공방 일손 돕기</option>
                 <option>메아리 예술단 공연 스태프</option>
                 <option>일반 행정 및 사무 보조</option>
                 <option>기타</option>
               </select>
             </div>

             <div className="space-y-3">
               <label className="text-sm font-bold text-stone-700 ml-1">남기실 말씀</label>
               <textarea rows={5} className="w-full px-5 py-4 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all resize-none shadow-inner font-medium text-stone-800" placeholder="봉사 가능한 요일이나 시간대 등 자유롭게 작성해주세요."></textarea>
             </div>
           </form>
        </div>
        <div className="p-6 md:px-14 md:py-8 bg-stone-50/50 border-t border-stone-100 flex justify-end relative z-10">
           <button className="flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all duration-300 shadow-[0_8px_20px_-8px_rgba(225,29,72,0.5)] hover:shadow-[0_0_20px_4px_rgba(244,63,94,0.6)] hover:-translate-y-1 hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 active:scale-95 border border-rose-400">
             <Send className="w-4 h-4 drop-shadow-sm" />
             신청서 제출하기
           </button>
        </div>
      </div>
    </div>
  );
}
