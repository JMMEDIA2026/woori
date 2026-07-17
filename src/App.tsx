import React, { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Terminal,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Navigation from "./components/Navigation";
import DashboardHome from "./components/DashboardHome";
import ImpactPillars from "./components/ImpactPillars";

// Pages in page/ folder
import Greetings from "./page/Greetings";
import Organization from "./page/Organization";
import History from "./page/History";
import Directions from "./page/Directions";
import AdminDashboard from "./page/AdminDashboard";
import SiteGallery from "./page/SiteGallery";
import AcademicLibrary from "./page/AcademicLibrary";
import CommunityBoard from "./page/CommunityBoard";
import DigitalFundraising from "./page/DigitalFundraising";
import CounselingShelter from "./page/CounselingShelter";

// 5 Key Activity Unsplash Slides for the primary carousel
const primarySlides = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1200",
    badge: "따뜻한 연대 나눔",
    title: "우리원 주관 온정 가득 사랑의 김장·밑반찬 나눔 축제",
    description:
      "충남 지역 봉사자들과 우리원 단원들이 상생 협력하여 정성껏 마련한 영양 밑반찬 배달 연합 마당",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200",
    badge: "수공예 자립 공방",
    title: "우리원 협동조합 한복인형 및 점토 도예 생산소",
    description:
      "단순 보조금 수혜에서 탈피하여 손수 제작한 단가 매출로 경제적 자립을 엮는 공간",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200",
    badge: "가치 정착 멘토링",
    title: "1:1 전문 치유 동료 코치 상담 및 자활 연계 마당",
    description:
      "같은 고향의 아픔을 상호 연대와 치유로 함께 극복해낸 우수 탈북 선배 단원의 정서 멘토링 활동",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
    badge: "메아리 예술단 공연",
    title: "MBJK 메아리 예술단 전통 가락과 무용 순회 공연",
    description:
      "전국 거점 및 복지센터를 돌며 전통 풍자극과 신명나는 소식으로 소통과 조화를 엮는 무대 마당",
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
    badge: "자율 자립 마중터",
    title: "충남 온양온천역 인근 위기 단원 자율 자립 정착 마중터",
    description:
      "단원들이 자립 정보를 교류하고 상생을 피워내는 따뜻하고 품격 있는 정서 소통 공간",
  },
];

export default function App() {
  const [view, setView] = useState<string>("home");
  const [subView, setSubView] = useState<string>("");

  // Main Home Hero Carousel state in App.tsx
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [sliderAutoplay, setSliderAutoplay] = useState<boolean>(true);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(
        "main section, main .group, main .bg-white.rounded-3xl, main .bg-white.rounded-\\[2rem\\]",
      );
      elements.forEach((el) => {
        if (!el.classList.contains("revealed")) {
          el.classList.add("reveal-on-scroll");
          observer.observe(el);
        }
      });
    }, 100);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [view, subView]);
  const [branding, setBranding] = useState({
    orgName: "비영리민간단체 우리원",
    slogan: "N·S WOORI_ONE UNION",
    logoUrl: "input_file_0.png",
  });

  useEffect(() => {
    async function loadBranding() {
      try {
        const response = await fetch("/api/branding");
        if (response.ok) {
          const data = await response.json();
          setBranding(data);
        }
      } catch (err) {
        console.error("Error loading branding in App:", err);
      }
    }
    loadBranding();
  }, []);

  useEffect(() => {
    if (!sliderAutoplay || view !== "home") return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % primarySlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderAutoplay, view]);

  // Router handler
  const handleSetView = (newView: string, targetSubView?: string) => {
    setView(newView);
    setSubView(targetSubView || "");
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans tracking-tight transition-colors duration-500 ease-in-out bg-stone-50 text-stone-800 selection:bg-rose-500/20">
      {/* Universal GNB header */}
      <Navigation
        currentView={view}
        currentSubView={subView}
        setView={handleSetView}
      />

      {/* Main Responsive Auto-playing Image Carousel with framer-motion/react (Cross-fade) */}
      {view === "home" && (
        <div className="w-full">
          <div className="relative overflow-hidden border-b border-stone-200 aspect-[21/9] md:aspect-[24/9] min-h-[340px] md:min-h-[460px] bg-stone-200 group select-none transition-all">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={activeSlide}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <img
                  src={primarySlides[activeSlide].imageUrl}
                  alt={primarySlides[activeSlide].title}
                  className="w-full h-full object-cover grayscale opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent"></div>

                {/* Overlay Text inside the slider aligned to the common max-w-7xl grid */}
                <div className="absolute inset-x-0 bottom-0 pb-10 pt-28 z-15 pointer-events-none">
                  <div className="max-w-7xl mx-auto px-4 md:px-8 text-white text-left">
                    <motion.span
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold bg-white/20 backdrop-blur-md border border-white/40 text-white tracking-widest uppercase mb-4 shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
                      {primarySlides[activeSlide].badge}
                    </motion.span>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.45 }}
                      className="font-bold text-xl md:text-2xl lg:text-3xl text-white tracking-tight leading-tight max-w-3xl"
                    >
                      {primarySlides[activeSlide].title}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      className="text-sm md:text-base text-stone-200 font-medium mt-3 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none"
                    >
                      {primarySlides[activeSlide].description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Left Prev Trigger arrow button */}
            <button
              id="btn-hero-prev"
              onClick={() =>
                setActiveSlide(
                  (prev) =>
                    (prev - 1 + primarySlides.length) % primarySlides.length,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 xl:scale-95 hover:bg-white/30 hover:scale-100 active:scale-95 z-20 focus:outline-none hover:shadow-[0_0_20px_2px_rgba(255,255,255,0.5)] hover:border-white hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 hover:ring-offset-transparent"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-md" />
            </button>

            {/* Right Next Trigger arrow button */}
            <button
              id="btn-hero-next"
              onClick={() =>
                setActiveSlide((prev) => (prev + 1) % primarySlides.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 xl:scale-95 hover:bg-white/30 hover:scale-100 active:scale-95 z-20 focus:outline-none hover:shadow-[0_0_20px_2px_rgba(255,255,255,0.5)] hover:border-white hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 hover:ring-offset-transparent"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-md" />
            </button>

            {/* Control HUD (Dot Indicators + Play/Pause Toggle button) */}
            <div className="absolute bottom-6 right-4 md:right-10 flex items-center gap-2.5 bg-white/20 backdrop-blur-md px-3.5 py-2 rounded-full z-20 text-white border border-white/30 shadow-lg">
              <button
                id="btn-hero-play-toggle"
                onClick={() => setSliderAutoplay(!sliderAutoplay)}
                className="p-1 text-white hover:text-rose-100 transition-all cursor-pointer focus:outline-none drop-shadow-md hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 hover:ring-offset-transparent active:scale-95 rounded-full"
                title={sliderAutoplay ? "일시정지" : "자동재생"}
              >
                {sliderAutoplay ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </button>

              <div className="w-px h-3.5 bg-white/40" />

              <div className="flex items-center gap-1.5">
                {primarySlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 hover:ring-offset-transparent active:scale-95 ${
                      activeSlide === idx
                        ? "w-4.5 bg-rose-500"
                        : "w-2 bg-white/60 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main visual portal body container: Flexible layout depending on Screen width or column needs */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:py-12">
        {view === "admin" ? (
          <div className="animate-fade-in">
            <AdminDashboard />
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row gap-8 items-start">
            {/* Main Content Area (Spans full width) */}
            <div className="w-full space-y-8 flex-wrap">
              {/* Active View Dispatcher */}
              {view === "home" && <DashboardHome setView={handleSetView} />}

              {view === "about" && (
                <div className="space-y-12 animate-fade-in">
                  {subView === "organization" ? (
                    <Organization />
                  ) : subView === "timeline" ? (
                    <History />
                  ) : subView === "directions" ? (
                    <Directions />
                  ) : (
                    <Greetings />
                  )}
                </div>
              )}

              {view === "impact" && (
                <ImpactPillars
                  setView={handleSetView}
                  activeSubSection={subView}
                />
              )}

              {view === "news" &&
                (subView === "library" ? (
                  <AcademicLibrary />
                ) : subView === "feed" ? (
                  <SiteGallery />
                ) : (
                  <CommunityBoard activeSubSection={subView} />
                ))}

              {view === "support" &&
                (subView === "fund" ? (
                  <DigitalFundraising />
                ) : subView === "volunteer" ? (
                  <CounselingShelter />
                ) : (
                  <CommunityBoard activeSubSection="qna" />
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Clean Structured Footer */}
      <footer className="border-t py-12 px-4 transition-all bg-stone-100 border-stone-200 text-stone-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Logo brand */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2 text-left">
              <div className="w-9 h-9 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-base shadow-sm">
                N.S
              </div>
              <div>
                <p className="font-bold text-sm tracking-tight text-stone-800">
                  {branding.orgName}
                </p>
                <p className="text-[10px] tracking-widest mt-0.5 text-stone-500">
                  {branding.slogan}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-stone-500">
              탈북민의 권익 신장, 시니어 단원 1:1 동료 치유 멘토링, MBJK 메아리
              예술단 가동 및 사단법인 탈북민공익활동지원연합을 가동하는 충남
              아산 거점 연합체입니다.
            </p>
          </div>

          {/* Registration Details columns */}
          <div className="md:col-span-5 space-y-2 text-xs">
            <h4 className="font-bold text-sm text-stone-800">
              기관 인가 공직 신고 사항
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 leading-relaxed font-semibold text-stone-500">
              <p>충청남도 비영리 등록: 제1540호</p>
              <p>기부금 공익 대상 지정: 행안부 등기</p>
              <p>주무 관청 인가: 통일부 소관사단</p>
              <p>대표권 소유: 채신아 이사장</p>
              <p>상임 행정 총괄: 이은택 사무총장</p>
              <p>내외 전무 감사: 실무위원회</p>
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="md:col-span-3 space-y-3 text-xs text-left">
            <h4 className="font-bold text-sm text-stone-800">
              상설 사무처 연락수단
            </h4>
            <div className="space-y-1 font-semibold text-stone-500">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>충청남도 아산시 충무로 & 아산로</span>
              </p>
              <p className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                <span>041-543-9060 (치유상담실 번호)</span>
              </p>
              <p>후원 전용: 농협 301-0251-8906-41 우리원</p>
            </div>
          </div>
        </div>

        {/* copyright and credentials */}
        <div className="max-w-7xl mx-auto border-t border-stone-200 mt-10 pt-6 text-center text-xs text-stone-400">
          <p className="font-semibold flex items-center justify-center gap-4">
            <span>
              Copyright © 2026 비영리민간단체 우리원 & 사단법인
              탈북민공익활동지원연합. All Rights Reserved.
            </span>
            <button
              onClick={() => setView("admin")}
              className="px-3 py-1 rounded-full bg-white text-[10px] font-bold text-stone-500 hover:text-indigo-600 transition-all duration-300 uppercase tracking-widest border border-stone-200 hover:border-indigo-400 hover:shadow-[0_0_15px_2px_rgba(129,140,248,0.4)] hover:-translate-y-0.5 hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 active:scale-95"
            >
              Admin
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
}
