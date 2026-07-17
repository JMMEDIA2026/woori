import fs from 'fs';

const code = `import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Heart,
  Users,
  ShieldCheck,
  Image as ImageIcon,
  FileText,
  Handshake,
  MessageCircle,
  Music,
  PlayCircle,
  ChevronRight
} from "lucide-react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const defaultPartners = [
  { name: "국세청", img: "https://upload.wikimedia.org/wikipedia/commons/4/41/Logo_of_the_National_Tax_Service.svg", url: "#" },
  { name: "한국사회복지협의회", img: "https://ssnc.vms.or.kr/images/layout/logo.svg", url: "#" },
  { name: "초록우산어린이재단", img: "https://www.childfund.or.kr/design/img/layout/logo.svg", url: "#" },
  { name: "월드비전", img: "https://www.worldvision.or.kr/resources/images/common/logo.svg", url: "#" },
];

export default function DashboardHome({
  setView,
}: {
  setView: (view: string, sub?: string) => void;
}) {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [noticeItems, setNoticeItems] = useState<any[]>([]);
  const [videoItems, setVideoItems] = useState<any[]>([]);
  const [featureImg1, setFeatureImg1] = useState(
    "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=1200&auto=format&fit=crop"
  );
  const [partners, setPartners] = useState(defaultPartners);

  useEffect(() => {
    const fetchData = async () => {
      let hasData = false;
      try {
        const bannerDoc = await getDoc(doc(db, "banners", "main"));
        if (bannerDoc.exists()) {
          const data = bannerDoc.data();
          if (data.img1) setFeatureImg1(data.img1);
        }

        const partnersSnapshot = await getDocs(
          query(collection(db, "partners"), orderBy("order"))
        );
        if (!partnersSnapshot.empty) {
          setPartners(partnersSnapshot.docs.map((doc) => doc.data() as any));
        }

        const postsSnapshot = await getDocs(
          query(collection(db, "posts"), orderBy("createdAt", "desc"))
        );
        const posts = postsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as any)
        );

        const gallery = posts.filter((p) => p.type === "gallery").slice(0, 3);
        const notices = posts.filter((p) => p.type === "notice").slice(0, 3);
        const videos = posts.filter((p) => p.type === "video").slice(0, 3);

        if (gallery.length > 0) setGalleryItems(gallery);
        if (notices.length > 0) setNoticeItems(notices);
        if (videos.length > 0) setVideoItems(videos);

        if (gallery.length > 0 || notices.length > 0 || videos.length > 0) {
          hasData = true;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (!hasData) {
        setGalleryItems([
          { id: 1, title: "따뜻한 겨울나기 지원", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600&auto=format&fit=crop", date: "2024.11.15" },
          { id: 2, title: "청소년 장학금 수여식", img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600&auto=format&fit=crop", date: "2024.10.20" },
          { id: 3, title: "의료비 지원 캠페인", img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop", date: "2024.09.05" },
        ]);
        setNoticeItems([
          { id: 1, title: "2024년도 하반기 지원사업 안내", date: "2024.11.20" },
          { id: 2, title: "이사회 임원 변동 안내", date: "2024.11.01" },
          { id: 3, title: "결산 공시 안내", date: "2024.10.15" },
        ]);
        setVideoItems([
          { id: 1, title: "우리원 홍보 영상", img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=600&auto=format&fit=crop", date: "2024.11.20" },
        ]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full bg-stone-50 text-stone-900 font-sans pb-32 selection:bg-amber-900 selection:text-amber-50">
      
      {/* 1. Hero Section - Premium Cinematic */}
      <section className="relative w-full h-[85vh] lg:h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={featureImg1}
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-stone-950/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-20">
          <span className="text-amber-400 font-medium tracking-[0.3em] text-lg lg:text-xl uppercase mb-6 drop-shadow-md">
            Woori One Foundation
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] mb-8 drop-shadow-xl">
            희망을 잇고<br className="hidden md:block" />
            <span className="text-stone-300 font-light">내일을 만듭니다</span>
          </h1>
          <p className="text-stone-300 text-xl lg:text-2xl max-w-2xl font-light leading-relaxed mb-12 drop-shadow-md">
            상처받은 마음을 보듬고, 스스로 일어설 수 있는 든든한 버팀목이 되겠습니다.
          </p>
          
          <button
            onClick={() => setView("support", "fund")}
            className="group relative overflow-hidden px-10 py-5 bg-white text-stone-950 rounded-none border border-transparent hover:border-amber-500 transition-all duration-500"
          >
            <div className="absolute inset-0 w-0 bg-amber-500 transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
            <span className="relative z-10 font-bold text-xl lg:text-2xl tracking-wider flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              후원 참여하기 <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </section>

      {/* 2. Core Values - Elegant Typography & Grid */}
      <section className="py-24 lg:py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-amber-700 font-semibold tracking-[0.2em] text-lg lg:text-xl uppercase mb-4">
              Our Core Values
            </h2>
            <h3 className="text-4xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight">
              우리가 지켜가는<br />변화의 약속
            </h3>
          </div>
          <p className="text-stone-500 text-xl lg:text-2xl max-w-md font-light leading-relaxed">
            단순한 지원을 넘어 개인의 온전한 회복과 지속 가능한 자립을 지향합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {[
            { title: "희망 나눔", desc: "조건 없는 나눔으로 따뜻한 위로와 새로운 희망을 전합니다.", Icon: Heart },
            { title: "자립 지원", desc: "스스로 설 수 있도록 교육과 실질적인 인프라를 제공합니다.", Icon: Handshake },
            { title: "치유 멘토링", desc: "상처를 깊이 보듬고 새로운 출발을 함께 응원합니다.", Icon: MessageCircle },
            { title: "문화 예술", desc: "예술을 매개로 내면의 아름다움과 정서적 안정을 회복합니다.", Icon: Music },
          ].map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="w-16 h-16 border border-stone-300 rounded-full flex items-center justify-center mb-8 group-hover:border-amber-600 group-hover:bg-amber-600 transition-colors duration-500">
                <item.Icon className="w-7 h-7 text-stone-400 group-hover:text-white transition-colors duration-500 stroke-[1.5]" />
              </div>
              <h4 className="text-3xl font-bold text-stone-900 mb-4 group-hover:text-amber-700 transition-colors duration-300">
                {item.title}
              </h4>
              <p className="text-stone-500 text-lg leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Latest Highlights - Magazine Style */}
      <section className="py-24 lg:py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
              최근 소식
            </h2>
            <button
              onClick={() => setView("news", "feed")}
              className="text-lg font-medium text-stone-400 hover:text-amber-700 transition-colors flex items-center gap-2 group uppercase tracking-wider"
            >
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Featured Big Item */}
            {galleryItems.length > 0 && (
              <div 
                onClick={() => setView("news", "feed")}
                className="lg:col-span-8 group cursor-pointer"
              >
                <div className="relative overflow-hidden w-full aspect-[16/9] mb-6 bg-stone-100">
                  <img
                    src={galleryItems[0].img}
                    alt={galleryItems[0].title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 bg-stone-900 text-white px-4 py-2 text-sm font-bold tracking-widest uppercase">
                    Gallery
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="text-amber-700 font-medium text-lg pt-1 shrink-0">
                    {galleryItems[0].date}
                  </div>
                  <div>
                    <h3 className="text-3xl lg:text-5xl font-bold text-stone-900 mb-4 leading-tight group-hover:text-amber-700 transition-colors duration-300">
                      {galleryItems[0].title}
                    </h3>
                    <p className="text-stone-500 text-xl line-clamp-2 font-light leading-relaxed">
                      {galleryItems[0].content || "나눔과 희망의 현장을 공유합니다."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Smaller Items & Notices */}
            <div className="lg:col-span-4 flex flex-col gap-12">
              {/* Secondary Visual Item */}
              {galleryItems.length > 1 && (
                <div 
                  onClick={() => setView("news", "feed")}
                  className="group cursor-pointer flex flex-col gap-4"
                >
                  <div className="relative overflow-hidden w-full aspect-video bg-stone-100">
                    <img
                      src={galleryItems[1].img}
                      alt={galleryItems[1].title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="text-amber-700 font-medium text-sm mb-2">{galleryItems[1].date}</div>
                    <h3 className="text-2xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
                      {galleryItems[1].title}
                    </h3>
                  </div>
                </div>
              )}

              {/* Minimal Notice List */}
              <div className="border-t border-stone-200 pt-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-2xl font-bold text-stone-900">공지사항</h4>
                  <button onClick={() => setView("news", "notice")} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {noticeItems.slice(0, 3).map((notice, idx) => (
                    <div
                      key={idx}
                      onClick={() => setView("news", "notice")}
                      className="group flex flex-col gap-1 cursor-pointer"
                    >
                      <h5 className="text-lg font-medium text-stone-800 group-hover:text-amber-700 transition-colors truncate">
                        {notice.title}
                      </h5>
                      <span className="text-sm text-stone-400 font-light">
                        {notice.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Transparency & Trust - Deep Contrast */}
      <section className="bg-stone-950 text-white py-24 lg:py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="flex-1">
            <h2 className="text-amber-500 font-semibold tracking-[0.2em] text-lg uppercase mb-4">
              Transparency
            </h2>
            <h3 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight mb-8">
              투명하고 정직하게<br />운영합니다
            </h3>
            <p className="text-stone-400 text-xl lg:text-2xl font-light leading-relaxed max-w-xl mb-12">
              법정 기부금 단체로서 철저한 이사회 감사와 외부 공시를 통해 보내주신 소중한 마음을 가장 투명하게 관리합니다.
            </p>
            <button
              onClick={() => setView("news", "library")}
              className="inline-flex items-center gap-3 px-8 py-4 border border-stone-700 hover:border-amber-500 text-lg font-medium transition-all duration-300 hover:text-amber-400"
            >
              투명공시 자료실 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-10 border border-stone-800 bg-stone-900/50 hover:bg-stone-900 transition-colors duration-500 flex flex-col">
              <ShieldCheck className="w-10 h-10 text-stone-500 mb-6 stroke-[1.5]" />
              <h4 className="text-2xl font-bold mb-3">법정 기부금 단체</h4>
              <p className="text-stone-400 font-light leading-relaxed">기획재정부 지정 단체로 연말정산 기부금 영수증이 발급됩니다.</p>
            </div>
            <div className="p-10 border border-stone-800 bg-stone-900/50 hover:bg-stone-900 transition-colors duration-500 flex flex-col">
              <Users className="w-10 h-10 text-stone-500 mb-6 stroke-[1.5]" />
              <h4 className="text-2xl font-bold mb-3">독립적 감사기구</h4>
              <p className="text-stone-400 font-light leading-relaxed">내외부 독립적인 이사회 감사를 통해 회계 투명성을 검증받습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Partners Marquee - Minimal Monotone */}
      <section className="py-20 bg-stone-50 overflow-hidden relative border-t border-stone-200">
        <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center mb-12">
           <h4 className="text-stone-400 uppercase tracking-[0.2em] text-sm font-medium">Trusted Partners</h4>
        </div>

        <div className="flex w-max animate-marquee hover:animation-play-state-paused items-center opacity-40 hover:opacity-100 transition-opacity duration-700">
          {[...partners, ...partners, ...partners, ...partners].map(
            (partner, idx) => (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-16 shrink-0 group cursor-pointer"
              >
                <img
                  src={partner.img}
                  alt={partner.name}
                  className="h-12 w-auto grayscale transition-all duration-500 object-contain mix-blend-multiply opacity-70 group-hover:opacity-100"
                />
              </a>
            ),
          )}
        </div>
      </section>
      
      {/* Global Style overrides for this component */}
      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1.02); }
          to { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
`

fs.writeFileSync('src/components/DashboardHome.tsx', code);
