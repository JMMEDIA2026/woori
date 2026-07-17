import React, { useState } from "react";
import { Menu, X, ChevronDown, UserCheck, ShieldAlert, Sparkles, Building2, MapPin, Search, Heart, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavigationProps {
  currentView: string;
  currentSubView: string;
  setView: (newView: string, targetSubView?: string) => void;
}

const MENUS = [
  {
    id: "about",
    label: "단체 소개",
    subs: [
      { id: "message", label: "대표 인사말", icon: UserCheck, desc: "이사장 및 임원진 인사말" },
      { id: "organization", label: "조직도", icon: Building2, desc: "운영진 및 위원회 구성" },
      { id: "timeline", label: "연혁", icon: Sparkles, desc: "우리원이 걸어온 길" },
      { id: "directions", label: "오시는 길", icon: MapPin, desc: "상설 사무처 위치" }
    ]
  },
  {
    id: "impact",
    label: "핵심 가치",
    subs: [
      { id: "core", label: "주요 사업 분야", desc: "4대 핵심 비전" }
    ]
  },
  {
    id: "news",
    label: "활동 소식",
    subs: [
      { id: "feed", label: "단체 갤러리", desc: "생생한 현장 스케치" },
      { id: "library", label: "자료실", desc: "사업보고서 및 간행물" },
      { id: "notice", label: "공지사항", desc: "우리원 주요 알림" }
    ]
  },
  {
    id: "support",
    label: "후원 및 연대",
    subs: [
      { id: "fund", label: "정기 후원 안내", desc: "따뜻한 마음 나누기" },
      { id: "volunteer", label: "자원봉사 신청", desc: "함께 만드는 변화" },
      { id: "qna", label: "후원 문의", desc: "자주 묻는 질문" }
    ]
  }
];

export default function Navigation({ currentView, currentSubView, setView }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDrop, setActiveDrop] = useState<string | null>(null);

  const handleMenuClick = (menuId: string, subId?: string) => {
    setView(menuId, subId);
    setMobileOpen(false);
    setActiveDrop(null);
  };

  return (
    <header className="sticky top-0 z-50 transition-all bg-white/90 backdrop-blur-xl border-b border-stone-200 text-stone-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8 min-h-[5rem] py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <button 
          id="logo-brand-btn"
          onClick={() => handleMenuClick("home")}
          className="flex items-center gap-2 cursor-pointer group hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 hover:ring-offset-white active:scale-95 transition-all rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center font-black text-rose-500 border border-rose-100 group-hover:bg-rose-100 transition-all shadow-sm">
            N.S
          </div>
          <div className="flex flex-col items-start text-left ml-1">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-lg md:text-xl tracking-tight text-stone-900">우리원</span>
            </div>
            <span className="text-[10px] tracking-[0.2em] mt-1 text-stone-400 font-medium">WOORI_ONE</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-4 h-full relative z-50">
          {MENUS.map((menu) => {
            const isActive = currentView === menu.id;
            const isHovered = activeDrop === menu.id;
            
            return (
              <div 
                key={menu.id} 
                className="relative h-full flex items-center px-2 py-4"
                onMouseEnter={() => setActiveDrop(menu.id)}
                onMouseLeave={() => setActiveDrop(null)}
              >
                <button
                  onClick={() => handleMenuClick(menu.id, menu.subs[0].id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-[15px] transition-all cursor-pointer hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 active:scale-95 ${
                    isActive 
                      ? "text-rose-600 bg-rose-50" 
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  {menu.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHovered ? "rotate-180" : ""}`} />
                </button>

                {/* Sub Menu Dropdown */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-[80%] left-0 min-w-[280px] bg-white border border-stone-100 rounded-2xl shadow-xl p-3 z-50"
                    >
                      <div className="flex flex-col gap-1">
                        {menu.subs.map((sub) => {
                          const isSubActive = currentView === menu.id && currentSubView === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleMenuClick(menu.id, sub.id)}
                              className={`flex flex-col items-start px-4 py-3 rounded-xl transition-all cursor-pointer text-left hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 active:scale-95 ${
                                isSubActive
                                  ? "bg-rose-50 border border-rose-100"
                                  : "hover:bg-stone-50 border border-transparent"
                              }`}
                            >
                              <span className={`font-bold text-sm ${isSubActive ? "text-rose-600" : "text-stone-800"}`}>
                                {sub.label}
                              </span>
                              <span className="text-xs text-stone-500 mt-1">{sub.desc}</span>
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
        <div className="hidden lg:flex items-center gap-3">
          <button 
            onClick={() => handleMenuClick("support", "fund")}
            className="px-6 py-2.5 rounded-full bg-rose-500 text-white font-bold text-sm transition-all duration-300 shadow-[0_8px_20px_-8px_rgba(225,29,72,0.5)] flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_0_20px_4px_rgba(244,63,94,0.6)] border border-rose-400 hover:border-rose-300 hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 active:scale-95"
          >
            <span>후원하기</span>
            <Heart className="w-4 h-4 fill-current drop-shadow-md" />
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          id="mobile-menu-toggle-btn"
          className="lg:hidden p-2 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 cursor-pointer transition-all hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 active:scale-95"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-stone-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {MENUS.map(menu => (
                <div key={menu.id} className="space-y-3">
                  <h3 className="font-black text-sm text-rose-500 uppercase tracking-widest pl-2">
                    {menu.label}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {menu.subs.map(sub => {
                      const isSubActive = currentView === menu.id && currentSubView === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleMenuClick(menu.id, sub.id)}
                          className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-left cursor-pointer transition-all hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 active:scale-95 ${
                            isSubActive 
                              ? "bg-rose-50 text-rose-600 border border-rose-100" 
                              : "bg-stone-50 text-stone-700 border border-transparent"
                          }`}
                        >
                          <span className="font-bold text-[15px]">{sub.label}</span>
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="pt-6 pb-2">
                <button 
                  onClick={() => handleMenuClick("support", "fund")}
                  className="w-full py-4 rounded-xl bg-rose-500 text-white font-extrabold text-base flex justify-center items-center gap-2 cursor-pointer shadow-[0_10px_20px_-10px_rgba(225,29,72,0.5)] transition-all duration-300 hover:shadow-[0_0_20px_4px_rgba(244,63,94,0.6)] border border-rose-400 hover:-translate-y-1 hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 active:scale-95"
                >
                  따뜻한 후원 함께하기
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
