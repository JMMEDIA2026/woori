import React, { useState } from "react";
import { ChevronDown, Heart, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const MENUS = [
  {
    id: "about",
    label: "기관소개",
    subs: [
      { id: "intro", label: "인사말", desc: "대표 인사말 및 설립 취지" },
      { id: "vision", label: "비전 및 연혁", desc: "우리가 걸어온 길" },
      { id: "organization", label: "조직도", desc: "함께하는 사람들" },
      { id: "directions", label: "오시는 길", desc: "찾아오시는 길 안내" },
    ],
  },
  {
    id: "business",
    label: "주요사업",
    subs: [
      { id: "core", label: "핵심사업", desc: "자립 및 성장을 위한 주요 지원" },
      { id: "campaign", label: "캠페인", desc: "진행 중인 나눔 캠페인" },
      { id: "volunteer", label: "봉사활동", desc: "참여형 봉사 프로그램" },
    ],
  },
  {
    id: "news",
    label: "새소식",
    subs: [
      { id: "notice", label: "공지사항", desc: "주요 안내 및 공지" },
      { id: "feed", label: "갤러리", desc: "활동 소식 및 사진" },
      { id: "video", label: "영상", desc: "홍보 및 활동 영상" },
      { id: "library", label: "자료실", desc: "투명 경영 공시 자료" },
    ],
  },
  {
    id: "support",
    label: "후원안내",
    subs: [
      { id: "guide", label: "후원안내", desc: "다양한 후원 방법 안내" },
      { id: "fund", label: "후원하기", desc: "따뜻한 나눔 참여하기" },
      { id: "faq", label: "자주 묻는 질문", desc: "후원 관련 궁금증 해결" },
    ],
  },
];

export default function Navigation({
  currentView,
  currentSubView,
  setView,
}: {
  currentView: string;
  currentSubView: string;
  setView: (view: string, sub?: string) => void;
}) {
  const [activeDrop, setActiveDrop] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = (viewId: string, subId?: string) => {
    setView(viewId, subId || MENUS.find(m => m.id === viewId)?.subs[0].id);
    setMobileOpen(false);
    setActiveDrop(null);
  };

  return (
    <header className="sticky top-0 z-50 transition-all bg-white/90 backdrop-blur-xl border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 min-h-[5.5rem] flex items-center justify-between">
        
        {/* LOGO */}
        <button 
          id="logo-brand-btn"
          onClick={() => handleMenuClick("home")}
          className="flex items-center gap-3 cursor-pointer group transition-all"
        >
          <div className="w-12 h-12 flex items-center justify-center font-black text-white bg-slate-900 group-hover:bg-blue-600 transition-colors duration-300">
            N.S
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="font-black text-2xl md:text-3xl tracking-tight text-slate-900">우리원</span>
            <span className="text-[10px] tracking-[0.25em] text-slate-400 font-bold uppercase mt-0.5">Woori_One</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 h-full relative z-50">
          {MENUS.map((menu) => {
            const isActive = currentView === menu.id;
            const isHovered = activeDrop === menu.id;
            
            return (
              <div 
                key={menu.id} 
                className="relative h-full flex items-center py-6"
                onMouseEnter={() => setActiveDrop(menu.id)}
                onMouseLeave={() => setActiveDrop(null)}
              >
                <button
                  onClick={() => handleMenuClick(menu.id, menu.subs[0].id)}
                  className={`flex items-center gap-1.5 font-bold text-[15px] transition-colors cursor-pointer tracking-wide ${
                    isActive || isHovered
                      ? "text-blue-700" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {menu.label}
                </button>

                {/* Sub Menu Dropdown */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-[90%] left-1/2 -translate-x-1/2 min-w-[320px] bg-white border border-slate-200 shadow-2xl p-4 z-50 rounded-xl"
                    >
                      <div className="flex flex-col gap-1">
                        {menu.subs.map((sub) => {
                          const isSubActive = currentView === menu.id && currentSubView === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleMenuClick(menu.id, sub.id)}
                              className={`flex flex-col items-start px-5 py-4 transition-colors cursor-pointer text-left rounded-lg ${
                                isSubActive
                                  ? "bg-slate-50"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <span className={`font-bold text-lg ${isSubActive ? "text-blue-700" : "text-slate-900"}`}>
                                {sub.label}
                              </span>
                              <span className="text-sm text-slate-500 mt-1 font-light">{sub.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right Utility Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={() => handleMenuClick("support", "fund")}
            className="px-8 py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-[15px] transition-colors duration-300 flex items-center gap-2 cursor-pointer uppercase tracking-widest"
          >
            <span>후원하기</span>
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          id="mobile-menu-toggle-btn"
          className="lg:hidden p-2 text-slate-900 cursor-pointer transition-colors hover:text-blue-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white overflow-hidden"
          >
            <div className="px-6 py-8 space-y-8 max-h-[80vh] overflow-y-auto">
              {MENUS.map(menu => (
                <div key={menu.id} className="space-y-4">
                  <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest">
                    {menu.label}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {menu.subs.map(sub => {
                      const isSubActive = currentView === menu.id && currentSubView === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleMenuClick(menu.id, sub.id)}
                          className={`flex items-center justify-between px-4 py-4 text-left cursor-pointer transition-colors rounded-lg ${
                            isSubActive 
                              ? "bg-slate-50 text-blue-700 font-bold border-l-2 border-blue-700" 
                              : "text-slate-700 font-medium hover:bg-slate-50 border-l-2 border-transparent"
                          }`}
                        >
                          <span className="text-lg">{sub.label}</span>
                          <ChevronRight className="w-5 h-5 opacity-40" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="pt-8 pb-4">
                <button 
                  onClick={() => handleMenuClick("support", "fund")}
                  className="w-full py-4 bg-slate-900 text-white font-bold text-lg flex justify-center items-center gap-2 cursor-pointer transition-colors hover:bg-blue-600 uppercase tracking-widest rounded-xl"
                >
                  후원 참여하기
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
