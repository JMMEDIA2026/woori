import React from "react";

const HISTORY_DATA = [
  {
    year: "2025",
    events: [
      { month: "12", desc: "사랑의 김장 나눔 축제 개최" },
      { month: "08", desc: "아산시 누적 멘토링 수혜자 3,200명 돌파" },
      { month: "03", desc: "우리원 자립 공방 수공예 매출 1억원 달성" }
    ]
  },
  {
    year: "2024",
    events: [
      { month: "10", desc: "MBJK 메아리 예술단 창단 및 전국 순회 공연 시작" },
      { month: "05", desc: "통일부 소관 비영리민간단체 공익 대상 지정" },
      { month: "01", desc: "아산시 온양온천역 자율 자립 정착 마중터 개소" }
    ]
  },
  {
    year: "2023",
    events: [
      { month: "11", desc: "1:1 전문 치유 동료 코치 상담 센터 운영 개시" },
      { month: "06", desc: "충청남도 비영리민간단체 등록 (제1540호)" },
      { month: "02", desc: "비영리민간단체 우리원 창립 총회" }
    ]
  }
];

export default function History() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-stone-900 drop-shadow-sm mb-4">연혁</h2>
        <p className="text-stone-500 font-medium">탈북민의 자립과 상생을 위해 우리원이 걸어온 길입니다.</p>
      </div>
      <div className="bg-white rounded-[2.5rem] p-8 md:p-14 border border-stone-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-rose-50/50 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute left-[45px] md:left-[111px] top-16 bottom-16 w-0.5 bg-gradient-to-b from-rose-200 via-rose-100 to-transparent"></div>
        <div className="space-y-16 relative z-10">
          {HISTORY_DATA.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="flex items-start gap-8 md:gap-14">
                <div className="w-20 md:w-28 shrink-0 text-right font-black text-3xl md:text-4xl text-rose-500 pt-1 group-hover:scale-105 transition-transform duration-300 origin-right drop-shadow-sm">
                  {item.year}
                </div>
                <div className="absolute left-[39px] md:left-[105px] w-3.5 h-3.5 rounded-full bg-rose-500 top-4 ring-4 ring-white shadow-sm group-hover:scale-125 transition-transform duration-300"></div>
                <div className="flex-1 space-y-7 pt-2">
                  {item.events.map((event, eIdx) => (
                    <div key={eIdx} className="flex gap-4 items-start p-3 -m-3 rounded-xl hover:bg-rose-50/50 transition-colors cursor-default">
                      <div className="w-8 shrink-0 font-bold text-stone-400 text-lg md:text-xl group-hover/item:text-rose-400 transition-colors">{event.month}</div>
                      <div className="text-stone-700 leading-relaxed font-semibold pt-0.5 md:text-lg">{event.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
