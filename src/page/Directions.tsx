import React from "react";
import { MapPin, PhoneCall, Clock, Car } from "lucide-react";

export default function Directions() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-6xl font-black text-slate-900 drop-shadow-sm mb-4">오시는 길</h2>
        <p className="text-slate-500 font-medium">우리원 상설 사무처 및 자립 공방 위치를 안내해 드립니다.</p>
      </div>
      <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] transition-shadow duration-500">
        {/* Map Placeholder */}
        <div className="w-full h-96 bg-slate-100 relative group cursor-pointer overflow-hidden">
           <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" alt="Map Area" className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-700" />
           <div className="absolute inset-0 bg-slate-100/50 mix-blend-multiply"></div>
           <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 group-hover:-translate-y-2 transition-transform duration-500">
             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 ring-8 ring-rose-500/20 animate-pulse">
               <MapPin className="w-8 h-8 text-white" />
             </div>
             <span className="text-slate-700 font-bold text-xl bg-white/90 px-5 py-2.5 rounded-full backdrop-blur-md border border-white shadow-lg">
               지도 API 연동 영역 (충청남도 아산시 충무로)
             </span>
           </div>
        </div>
        
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="group">
              <h3 className="text-4xl font-bold text-slate-900 mb-3 flex items-center gap-2 group-hover:text-slate-900 transition-colors">
                <MapPin className="w-6 h-6 text-blue-600" /> 주소
              </h3>
              <p className="text-slate-600 pl-8 font-medium leading-relaxed">충청남도 아산시 충무로 & 아산로<br/><span className="text-xl text-slate-400 font-normal">온양온천역 도보 10분 거리</span></p>
            </div>
            <div className="group">
              <h3 className="text-4xl font-bold text-slate-900 mb-3 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                <PhoneCall className="w-6 h-6 text-indigo-500" /> 연락처
              </h3>
              <p className="text-slate-600 pl-8 font-medium leading-relaxed">대표전화: 041-543-9060<br/>팩스: 041-543-9061<br/><span className="text-xl text-slate-400 font-normal">상담 시간 중 통화 가능</span></p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="group">
              <h3 className="text-4xl font-bold text-slate-900 mb-3 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                <Clock className="w-6 h-6 text-blue-500" /> 운영 시간
              </h3>
              <p className="text-slate-600 pl-8 font-medium leading-relaxed">평일: 09:00 - 18:00<br/>점심시간: 12:00 - 13:00<br/><span className="text-xl text-blue-600 font-bold mt-1 inline-block bg-slate-50 px-2 py-0.5 rounded">주말 및 공휴일 휴무</span></p>
            </div>
            <div className="group">
              <h3 className="text-4xl font-bold text-slate-900 mb-3 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                <Car className="w-6 h-6 text-emerald-500" /> 주차 안내
              </h3>
              <p className="text-slate-600 pl-8 font-medium leading-relaxed">건물 내 지하 주차장 이용 가능<br/>만차 시 인근 공영 주차장 이용 부탁드립니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
