import React from "react";

export default function Organization() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-6xl font-black text-slate-900 drop-shadow-sm mb-4">조직도</h2>
        <p className="text-slate-500 font-medium">투명하고 체계적인 운영을 위한 우리원의 조직 구성입니다.</p>
      </div>
      <div className="relative bg-white rounded-3xl p-8 md:p-16 border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 overflow-x-auto">
        <div className="flex flex-col items-center min-w-[700px]">
          {/* Board */}
          <div className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-3xl mb-8 shadow-lg text-center w-64 border border-slate-900 z-10 relative hover:ring-4 hover:ring-slate-200 transition-all cursor-default">
            총회 (이사회)
          </div>
          <div className="w-px h-8 bg-slate-300"></div>
          
          {/* Chairman */}
          <div className="bg-gradient-to-br from-rose-400 to-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-4xl mb-8 shadow-md shadow-rose-500/30 text-center w-64 border border-rose-600 z-10 relative ring-4 ring-rose-50 hover:ring-rose-200 transition-all cursor-default">
            이사장 (대표)
          </div>
          <div className="w-px h-8 bg-slate-300"></div>

          {/* Secretary General */}
          <div className="bg-white border-2 border-indigo-400 text-indigo-700 px-8 py-4 rounded-2xl font-bold text-3xl mb-8 shadow-sm text-center w-64 z-10 relative hover:bg-indigo-50 transition-colors cursor-default">
            사무총장 (상임행정)
          </div>
          
          {/* Branch Lines */}
          <div className="w-full max-w-3xl h-px bg-slate-300 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-300 -mt-8"></div>
            <div className="absolute top-0 left-0 w-px h-8 bg-slate-300"></div>
            <div className="absolute top-0 left-[33.33%] w-px h-8 bg-slate-300"></div>
            <div className="absolute top-0 right-[33.33%] w-px h-8 bg-slate-300"></div>
            <div className="absolute top-0 right-0 w-px h-8 bg-slate-300"></div>
          </div>
          
          {/* Departments */}
          <div className="grid grid-cols-4 gap-4 w-full max-w-3xl pt-8">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-rose-300 transition-all cursor-default group">
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-slate-900 transition-colors">실무위원회</h4>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">내/외 전무 감사<br/>사업 기획 및 평가</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-indigo-300 transition-all cursor-default group">
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">치유상담실</h4>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">1:1 정서 멘토링<br/>트라우마 극복 지원</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-blue-300 transition-all cursor-default group">
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">자립공방운영부</h4>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">수공예품 제작<br/>자체 수익 창출</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-emerald-300 transition-all cursor-default group">
              <h4 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">메아리예술단</h4>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">전통 가락 공연<br/>문화 예술 소통</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
