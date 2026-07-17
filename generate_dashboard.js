import fs from 'fs';

const code = `import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Info,
  Heart,
  Users,
  MapPin,
  Sparkles,
  HandHeart,
  ShieldCheck,
  Image as ImageIcon,
  FileText,
  Handshake,
  MessageCircle,
  Music,
  PlayCircle,
  FileSearch,
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
  {
    name: "국세청",
    img: "https://upload.wikimedia.org/wikipedia/commons/4/41/Logo_of_the_National_Tax_Service.svg",
    url: "#",
  },
  {
    name: "한국사회복지협의회",
    img: "https://ssnc.vms.or.kr/images/layout/logo.svg",
    url: "#",
  },
  {
    name: "초록우산어린이재단",
    img: "https://www.childfund.or.kr/design/img/layout/logo.svg",
    url: "#",
  },
  {
    name: "월드비전",
    img: "https://www.worldvision.or.kr/resources/images/common/logo.svg",
    url: "#",
  },
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
    "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop"
  );
  const [featureImg2, setFeatureImg2] = useState(
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop"
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
          if (data.img2) setFeatureImg2(data.img2);
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
          {
            id: 1,
            title: "따뜻한 겨울나기 지원",
            content: "겨울철 난방비 지원...",
            img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400&auto=format&fit=crop",
            date: "2024.11.15",
          },
          {
            id: 2,
            title: "청소년 장학금 수여식",
            content: "장학금 수여식 개최...",
            img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=400&auto=format&fit=crop",
            date: "2024.10.20",
          },
          {
            id: 3,
            title: "의료비 지원 캠페인",
            content: "의료 사각지대 해소...",
            img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=400&auto=format&fit=crop",
            date: "2024.09.05",
          },
        ]);
        setNoticeItems([
          { id: 1, title: "2024년도 하반기 지원사업 안내", date: "2024.11.20" },
          { id: 2, title: "이사회 임원 변동 안내", date: "2024.11.01" },
          { id: 3, title: "결산 공시 안내", date: "2024.10.15" },
        ]);
        setVideoItems([
          {
            id: 1,
            title: "우리원 홍보 영상",
            content: "우리원의 주요 활동을 소개합니다.",
            img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=400&auto=format&fit=crop",
            date: "2024.11.20",
          },
          {
            id: 2,
            title: "나눔 캠페인 스케치",
            content: "따뜻한 나눔의 현장입니다.",
            img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=400&auto=format&fit=crop",
            date: "2024.10.15",
          },
          {
            id: 3,
            title: "봉사자 인터뷰",
            content: "봉사자 분들의 생생한 후기",
            img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop",
            date: "2024.09.05",
          },
        ]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 text-stone-800 w-full animate-fade-in font-sans pb-20">
      
      {/* 1. Hero / Main Feature Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mt-4">
        {/* Gallery Hero Card */}
        <div 
          onClick={() => setView("news", "feed")}
          className="group relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] bg-white border border-stone-100 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer h-[400px] lg:h-[500px]"
        >
          <img
            src={galleryItems[0]?.img || featureImg1}
            alt="Gallery Feature"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"></div>
          
          <div className="absolute top-6 left-6 lg:top-8 lg:left-8">
            <span className="px-4 py-1.5 rounded-full bg-rose-500 text-white text-xs lg:text-sm font-bold tracking-wider shadow-lg flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              단체 갤러리
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 flex flex-col justify-end text-white">
            <div className="text-sm font-bold text-rose-300 mb-2">
              {galleryItems[0]?.date || "2024.11.15"}
            </div>
            <h3 className="text-2xl lg:text-4xl font-black mb-3 tracking-tight leading-tight line-clamp-2">
              {galleryItems[0]?.title || "생생한 변화의 순간을 담은 사진 갤러리"}
            </h3>
            <p className="text-stone-300 leading-relaxed line-clamp-2 text-sm lg:text-base">
              {galleryItems[0]?.content || "단순한 지원을 넘어 함께 만드는 희망의 현장을 공유합니다."}
            </p>
          </div>
        </div>

        {/* Video Hero Card */}
        <div 
          onClick={() => setView("news", "video")}
          className="group relative overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] bg-white border border-stone-100 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer h-[400px] lg:h-[500px]"
        >
          <img
            src={videoItems[0]?.img || featureImg2}
            alt="Video Feature"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:bg-indigo-500/80 transition-colors shadow-2xl">
              <PlayCircle className="w-8 h-8" />
            </div>
          </div>

          <div className="absolute top-6 left-6 lg:top-8 lg:left-8">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500 text-white text-xs lg:text-sm font-bold tracking-wider shadow-lg flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              영상 갤러리
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 flex flex-col justify-end text-white">
            <div className="text-sm font-bold text-indigo-300 mb-2">
              {videoItems[0]?.date || "2024.11.20"}
            </div>
            <h3 className="text-2xl lg:text-4xl font-black mb-3 tracking-tight leading-tight line-clamp-2">
              {videoItems[0]?.title || "마음을 울리는 따뜻한 이야기 영상"}
            </h3>
            <p className="text-stone-300 leading-relaxed line-clamp-2 text-sm lg:text-base">
              {videoItems[0]?.content || "더 나은 세상을 위해 땀 흘리는 현장의 목소리를 들어보세요."}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Core Values Bento Grid */}
      <section>
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">우리의 핵심 가치</h2>
          <p className="mt-3 text-stone-500 text-base lg:text-lg">상처를 보듬고 건강한 자립을 돕는 발걸음</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            {
              title: "희망 나눔",
              desc: "조건 없는 나눔으로 희망을 전합니다.",
              Icon: Heart,
              color: "text-rose-500",
              bg: "bg-rose-50/70",
              border: "border-rose-100",
            },
            {
              title: "자립 지원",
              desc: "스스로 설 수 있도록 든든한 버팀목이 됩니다.",
              Icon: Handshake,
              color: "text-emerald-500",
              bg: "bg-emerald-50/70",
              border: "border-emerald-100",
            },
            {
              title: "치유 멘토링",
              desc: "상처를 보듬고 새로운 출발을 응원합니다.",
              Icon: MessageCircle,
              color: "text-indigo-500",
              bg: "bg-indigo-50/70",
              border: "border-indigo-100",
            },
            {
              title: "문화 예술",
              desc: "예술을 통해 내면의 아름다움을 회복합니다.",
              Icon: Music,
              color: "text-amber-500",
              bg: "bg-amber-50/70",
              border: "border-amber-100",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={\`group p-8 rounded-3xl bg-white border \${item.border} flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer\`}
            >
              <div
                className={\`w-16 h-16 rounded-2xl \${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300\`}
              >
                <item.Icon className={\`w-8 h-8 \${item.color}\`} />
              </div>
              <h4 className="text-xl lg:text-2xl font-bold text-stone-900 mb-2">
                {item.title}
              </h4>
              <p className="text-stone-500 text-sm lg:text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Combined News & Notice Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Notices (Left/Top) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-8 flex flex-col shadow-sm">
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-stone-700" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">공지사항</h3>
            </div>
            <button
              onClick={() => setView("news", "notice")}
              className="text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              더보기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-1">
            {noticeItems.map((notice, idx) => (
              <div
                key={idx}
                onClick={() => setView("news", "notice")}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 -mx-4 rounded-2xl hover:bg-stone-50 transition-colors cursor-pointer border-b border-stone-100 last:border-0"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></div>
                  <h4 className="text-base font-medium text-stone-800 truncate group-hover:text-stone-900 transition-colors">
                    {notice.title}
                  </h4>
                </div>
                <span className="text-sm text-stone-400 shrink-0 ml-5 sm:ml-0 mt-2 sm:mt-0 font-medium">
                  {notice.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Gallery List (Right/Bottom) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-8 flex flex-col shadow-sm">
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">최근 갤러리</h3>
            </div>
            <button
              onClick={() => setView("news", "feed")}
              className="text-sm font-bold text-stone-400 hover:text-rose-500 transition-colors flex items-center gap-1"
            >
              더보기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setView("news", "feed")}
                className="group rounded-2xl border border-stone-100 overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative shrink-0">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1 bg-white border-t border-stone-100">
                  <h4 className="text-base font-bold text-stone-900 mb-1 line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="text-xs font-semibold text-stone-400 mt-auto pt-2">
                    {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Transparency / Info Section */}
      <section className="relative overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 items-center text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex-1 space-y-6">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
            투명성과 진정성을<br />
            최우선으로 합니다
          </h2>
          <p className="text-stone-300 leading-relaxed text-base lg:text-lg max-w-xl">
            우리원은 행정안전부 및 관할 세무서에 완벽히 보고되는 영수증 가용
            단체로서 높은 도덕적 책무성과 회계 투명성을 보증합니다. 매년
            기부금 활용 실적을 투명하게 공시합니다.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setView("news", "library")}
              className="px-8 py-4 rounded-full bg-white text-stone-900 text-base font-bold transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105 flex items-center gap-2"
            >
              <FileSearch className="w-5 h-5" />
              투명공시 자료실
            </button>
          </div>
        </div>
        
        <div className="relative z-10 flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div className="p-8 rounded-3xl bg-stone-800/50 backdrop-blur-sm border border-stone-700/50 flex flex-col">
            <ShieldCheck className="w-10 h-10 text-rose-400 mb-4" />
            <h4 className="text-xl font-bold mb-2">법정 기부금 단체</h4>
            <p className="text-stone-400 text-sm lg:text-base">연말정산 기부금 영수증 발급 가능 기관</p>
          </div>
          <div className="p-8 rounded-3xl bg-stone-800/50 backdrop-blur-sm border border-stone-700/50 flex flex-col">
            <Users className="w-10 h-10 text-indigo-400 mb-4" />
            <h4 className="text-xl font-bold mb-2">독립적 이사회 감사</h4>
            <p className="text-stone-400 text-sm lg:text-base">투명한 운영을 위한 독립적인 감사 기구 설치</p>
          </div>
        </div>
      </section>

      {/* 5. Partners Marquee */}
      <section className="py-12 border-y border-stone-100 bg-white overflow-hidden relative rounded-3xl shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none rounded-l-3xl"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none rounded-r-3xl"></div>
        <div className="flex w-max animate-marquee hover:animation-play-state-paused items-center">
          {[...partners, ...partners, ...partners, ...partners].map(
            (partner, idx) => (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-12 shrink-0 group cursor-pointer"
              >
                <img
                  src={partner.img}
                  alt={partner.name}
                  className="h-10 lg:h-12 w-auto opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 object-contain mix-blend-multiply"
                />
              </a>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
`

fs.writeFileSync('src/components/DashboardHome.tsx', code);
