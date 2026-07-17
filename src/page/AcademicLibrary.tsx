import React from "react";
import { FileText, Download } from "lucide-react";

export default function AcademicLibrary() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-stone-900 drop-shadow-sm mb-4">자료실</h2>
        <p className="text-stone-500 font-medium">우리원의 사업보고서 및 결산서, 주요 발간 자료를 투명하게 공개합니다.</p>
      </div>
      <div className="bg-white rounded-[2rem] border border-stone-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="divide-y divide-stone-100/80">
          {[
            "2025년도 기부금 활용 실적 및 결산 보고서",
            "2024년도 사업 추진 실적 보고서",
            "비영리민간단체 우리원 정관 (2024 개정판)",
            "우리원 소식지 '메아리' 제 12호 (2025년 봄호)",
            "2023년도 감사 보고서"
          ].map((title, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 hover:bg-stone-50/80 transition-colors gap-6 group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-100 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 mb-2 group-hover:text-indigo-600 transition-colors text-lg">{title}</h3>
                  <div className="text-xs font-medium text-stone-400 flex gap-4">
                    <span className="flex items-center gap-1">등록일: 2025.10.{20 - i}</span>
                    <span className="flex items-center gap-1">조회: {120 + i * 23}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-bold text-stone-600 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-[0_4px_12px_rgba(99,102,241,0.15)] hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
                <Download className="w-4 h-4" />
                다운로드
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
