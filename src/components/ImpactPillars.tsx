import React from "react";
import { Target, Heart, Briefcase, Zap } from "lucide-react";

export default function ImpactPillars({ activeSubSection }: { activeSubSection?: string, setView?: any }) {
  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-stone-900 drop-shadow-sm">4대 핵심 비전</h2>
        <p className="text-stone-500 max-w-2xl mx-auto font-medium">우리원이 추구하는 자립과 상생의 핵심 가치입니다.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: Target, title: "맞춤형 정서 치유", desc: "탈북민의 트라우마 극복을 위한 1:1 동료 상담", color: "rose" },
          { icon: Heart, title: "따뜻한 연대 나눔", desc: "지역 사회와 함께하는 봉사 및 나눔 활동", color: "indigo" },
          { icon: Briefcase, title: "경제적 자립 공방", desc: "수공예 기술 교육 및 자체 수익 창출 기반 마련", color: "amber" },
          { icon: Zap, title: "문화 예술 소통", desc: "메아리 예술단 공연을 통한 평화와 화합의 메시지 전달", color: "emerald" }
        ].map((item, i) => (
          <div key={i} className={`group bg-white border border-stone-100 p-8 rounded-[2rem] hover:border-${item.color}-300 transition-all duration-500 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className={`relative z-10 w-14 h-14 rounded-2xl bg-${item.color}-50 flex items-center justify-center mb-5 border border-${item.color}-100 group-hover:scale-110 transition-transform duration-500`}>
              <item.icon className={`w-7 h-7 text-${item.color}-500`} />
            </div>
            <h3 className="relative z-10 text-xl font-bold text-stone-900 mb-2">{item.title}</h3>
            <p className="relative z-10 text-stone-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
