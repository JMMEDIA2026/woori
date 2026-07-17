import React, { useState, useEffect } from "react";
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
    url: "https://www.nts.go.kr/",
  },
  {
    name: "통일부",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/60/Logo_of_the_Ministry_of_Unification.svg",
    url: "https://www.unikorea.go.kr/",
  },
  {
    name: "국민권익위원회",
    img: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Logo_of_the_Anti-Corruption_and_Civil_Rights_Commission.svg",
    url: "https://www.acrc.go.kr/",
  },
  {
    name: "남북하나재단",
    img: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iODAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY0NzQ4YiI+64Ko67aB7ZWY64KY7J6s64uoPC90ZXh0Pjwvc3ZnPg==",
    url: "https://www.koreahana.or.kr/",
  },
  {
    name: "대한적십자사",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Emblem_of_the_Red_Cross_of_Korea.svg/512px-Emblem_of_the_Red_Cross_of_Korea.svg.png",
    url: "https://www.redcross.or.kr/",
  },
  {
    name: "행정안전부",
    img: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_of_the_Ministry_of_the_Interior_and_Safety.svg",
    url: "https://www.mois.go.kr/",
  },
  {
    name: "사회복지공동모금회",
    img: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Community_Chest_of_Korea_logo.svg",
    url: "https://www.chest.or.kr/",
  },
];

export default function DashboardHome({
  setView,
}: {
  setView: (v: string, sub?: string) => void;
}) {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [noticeItems, setNoticeItems] = useState<any[]>([]);
  const [featureImg1, setFeatureImg1] = useState(
    "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop",
  );
  const [featureImg2, setFeatureImg2] = useState(
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop",
  );
  const [partners, setPartners] =
    useState<{ name: string; img: string; url: string }[]>(defaultPartners);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load banners
        const bannerDoc = await getDoc(doc(db, "banners", "main"));
        if (bannerDoc.exists()) {
          const data = bannerDoc.data();
          if (data.img1) setFeatureImg1(data.img1);
          if (data.img2) setFeatureImg2(data.img2);
        }

        // Load partners
        const partnersSnapshot = await getDocs(
          query(collection(db, "partners"), orderBy("order")),
        );
        if (!partnersSnapshot.empty) {
          setPartners(partnersSnapshot.docs.map((doc) => doc.data() as any));
        }

        // Load posts
        const postsSnapshot = await getDocs(
          query(collection(db, "posts"), orderBy("createdAt", "desc")),
        );
        const posts = postsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as any,
        );

        const gallery = posts.filter((p) => p.type === "gallery").slice(0, 3);
        const notices = posts.filter((p) => p.type === "notice").slice(0, 3);

        // Add static fallbacks if empty
        if (gallery.length > 0) {
          setGalleryItems(gallery);
        } else {
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
              img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400&auto=format&fit=crop",
              date: "2024.10.20",
            },
            {
              id: 3,
              title: "의료비 지원 캠페인",
              content: "의료 사각지대 해소...",
              img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400&auto=format&fit=crop",
              date: "2024.09.05",
            },
          ]);
        }

        if (notices.length > 0) {
          setNoticeItems(notices);
        } else {
          setNoticeItems([
            {
              id: 1,
              title: "2024년도 하반기 지원사업 안내",
              date: "2024.11.20",
            },
            { id: 2, title: "이사회 임원 변동 안내", date: "2024.11.01" },
            { id: 3, title: "결산 공시 안내", date: "2024.10.15" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-24 text-stone-800 w-full animate-fade-in">
      {/* Core Values Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "희망 나눔",
              desc: "조건 없는 나눔으로 희망을 전합니다.",
              Icon: Heart,
              color: "text-rose-500",
              ring: "hover:ring-rose-400",
              shadow: "hover:shadow-[0_0_20px_2px_rgba(244,63,94,0.4)]",
              bg: "bg-rose-50/50",
            },
            {
              title: "자립 지원",
              desc: "스스로 설 수 있도록 든든한 버팀목이 됩니다.",
              Icon: Handshake,
              color: "text-emerald-500",
              ring: "hover:ring-emerald-400",
              shadow: "hover:shadow-[0_0_20px_2px_rgba(16,185,129,0.4)]",
              bg: "bg-emerald-50/50",
            },
            {
              title: "치유 멘토링",
              desc: "상처를 보듬고 새로운 출발을 응원합니다.",
              Icon: MessageCircle,
              color: "text-indigo-500",
              ring: "hover:ring-indigo-400",
              shadow: "hover:shadow-[0_0_20px_2px_rgba(99,102,241,0.4)]",
              bg: "bg-indigo-50/50",
            },
            {
              title: "예술 연대",
              desc: "문화와 예술을 통해 하나된 사회를 만듭니다.",
              Icon: Music,
              color: "text-amber-500",
              ring: "hover:ring-amber-400",
              shadow: "hover:shadow-[0_0_20px_2px_rgba(251,191,36,0.4)]",
              bg: "bg-amber-50/50",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`group p-8 rounded-3xl bg-white border border-stone-100 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:ring-2 hover:ring-offset-2 hover:ring-offset-transparent cursor-pointer ${item.ring} ${item.shadow}`}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.Icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">
                {item.title}
              </h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group relative overflow-hidden rounded-[2rem] bg-white border border-rose-100 flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="h-56 w-full overflow-hidden relative shrink-0">
            <img
              src={featureImg1}
              alt="자립과 성장의 요람"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                Core Value
              </span>
            </div>
          </div>
          <div className="p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-rose-50/30">
            <h3 className="text-2xl font-black text-stone-900 mb-3 tracking-tight">
              자립과 성장의 요람
            </h3>
            <p className="text-stone-500 leading-relaxed flex-1">
              단순한 금전적 지원을 넘어, 개인의 잠재력을 발견하고 스스로 일어설
              수 있는 실질적인 교육과 인프라를 제공합니다.
            </p>
            <button
              onClick={() => setView("about")}
              className="mt-6 flex items-center gap-2 text-rose-500 font-bold group/btn self-start"
            >
              우리의 방향성{" "}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] bg-white border border-indigo-100 flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="h-56 w-full overflow-hidden relative shrink-0">
            <img
              src={featureImg2}
              alt="따뜻한 나눔의 실천"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-1"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent"></div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                Our Mission
              </span>
            </div>
          </div>
          <div className="p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-indigo-50/30">
            <h3 className="text-2xl font-black text-stone-900 mb-3 tracking-tight">
              따뜻한 나눔의 실천
            </h3>
            <p className="text-stone-500 leading-relaxed flex-1">
              투명하고 공정한 후원금 관리를 통해 도움이 필요한 곳에 가장
              효과적으로 자원이 전달되도록 시스템을 구축합니다.
            </p>
            <button
              onClick={() => setView("impact")}
              className="mt-6 flex items-center gap-2 text-indigo-500 font-bold group/btn self-start"
            >
              지원 현황 보기{" "}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Board & Notice Section */}

      {/* Board & Notice Section */}
      <section className="max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-[2rem] border border-stone-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                  공지사항
                </h3>
              </div>
              <p className="text-sm text-stone-500">
                새로운 소식과 안내를 확인하세요.
              </p>
            </div>
            <button
              onClick={() => setView("news", "notice")}
              className="text-xs font-bold text-stone-400 hover:text-indigo-500 transition-colors flex items-center gap-1"
            >
              더보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {noticeItems.map((notice, idx) => (
              <div
                key={idx}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-stone-50 hover:bg-white border border-transparent hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 group-hover:scale-150 transition-transform"></span>
                  <p className="text-stone-800 font-medium truncate group-hover:text-indigo-600 transition-colors">
                    {notice.title}
                  </p>
                </div>
                <span className="text-xs text-stone-400 font-medium shrink-0 ml-5 sm:ml-0">
                  {notice.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Gallery Section */}
      <section className="w-full">
        {galleryItems.length > 0 && (
          <div className="bg-white rounded-[2rem] border border-stone-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-rose-500" />
                  <h3 className="text-xl font-bold text-stone-900 tracking-tight">단체 갤러리 최신글</h3>
                </div>
                <p className="text-sm text-stone-500">
                  우리가 만들어가는 변화의 순간들.
                </p>
              </div>
              <button
                onClick={() => setView("news", "feed")}
                className="text-xs font-bold text-stone-400 hover:text-rose-500 transition-colors flex items-center gap-1"
              >
                더보기 <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-stone-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden relative shrink-0">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 bg-white group-hover:bg-indigo-50/10 transition-colors border-t border-stone-100">
                    <h4 className="text-base font-bold text-stone-900 mb-2 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <div className="text-[10px] font-semibold text-stone-400 flex justify-between items-center mt-auto">
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="group rounded-[2.5rem] bg-white border border-stone-100 p-8 md:p-12 relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out">
        <div className="absolute top-0 right-0 p-32 bg-rose-50/50 blur-[100px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-[1.5]"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-black text-stone-900 tracking-tight leading-tight">
              투명성과 진정성을
              <br />
              최우선으로 합니다
            </h2>
            <p className="text-stone-500 leading-relaxed text-sm">
              우리원은 행정안전부 및 관할 세무서에 완벽히 보고되는 영수증 가용
              단체로서 높은 도덕적 책무성과 회계 투명성을 보증합니다. 매년
              기부금 활용 실적을 공시합니다.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setView("news", "library")}
                className="px-6 py-3 rounded-full bg-stone-100 hover:bg-white text-stone-700 text-sm font-bold transition-all duration-300 border border-stone-200 hover:border-indigo-400 hover:text-indigo-600 shadow-sm hover:shadow-[0_0_20px_2px_rgba(129,140,248,0.4)] hover:ring-2 hover:ring-rose-400 hover:ring-offset-2 active:scale-95"
              >
                투명공시 자료실
              </button>
            </div>
          </div>
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 flex flex-col items-center text-center hover:bg-white hover:border-rose-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ease-out">
              <ShieldCheck className="w-8 h-8 text-rose-500 mb-3" />
              <h4 className="font-bold text-stone-900 mb-1">
                법정 기부금 단체
              </h4>
              <p className="text-xs text-stone-500">기부금 영수증 발급</p>
            </div>
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 flex flex-col items-center text-center hover:bg-white hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ease-out">
              <Users className="w-8 h-8 text-indigo-500 mb-3" />
              <h4 className="font-bold text-stone-900 mb-1">이사회 감사</h4>
              <p className="text-xs text-stone-500">독립적인 감사 기구</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee Section */}
      <section className="py-12 border-y border-stone-100 bg-stone-50/50 overflow-hidden relative rounded-[2.5rem]">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none rounded-l-[2.5rem]"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none rounded-r-[2.5rem]"></div>

        <div className="flex w-max animate-marquee hover:animation-play-state-paused">
          {[...partners, ...partners, ...partners, ...partners].map(
            (partner, idx) => (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-8 md:px-12 shrink-0 group cursor-pointer"
              >
                <img
                  src={partner.img}
                  alt={partner.name}
                  className="h-10 md:h-12 w-auto opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 object-contain mix-blend-multiply"
                />
              </a>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
