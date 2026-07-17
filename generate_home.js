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
import { motion } from "motion/react";
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
          { id: 1, title: "따뜻한 겨울나기 지원", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600&auto=format&fit=crop", date: "2024.11.15", content: "추운 겨울을 맞아 지역 사회 소외계층에게 연탄과 난방용품을 지원했습니다." },
          { id: 2, title: "청소년 장학금 수여식", img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600&auto=format&fit=crop", date: "2024.10.20", content: "미래의 희망인 청소년들의 꿈을 응원하며 장학금을 전달했습니다." },
          { id: 3, title: "의료비 지원 캠페인", img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop", date: "2024.09.05", content: "저소득층 환자들의 의료비를 지원하여 건강한 내일을 약속합니다." },
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

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="w-full bg-[#FAFAF9] text-stone-900 font-sans pb-32 selection:bg-amber-900 selection:text-amber-50">
      
      {/* 1. Hero Section - Premium Cinematic */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-stone-950">
          <img
            src={featureImg1}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-50 scale-105 animate-[slowZoom_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/20 to-stone-950/90"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <span className="text-amber-500 font-medium tracking-[0.4em] text-sm lg:text-base uppercase mb-8 inline-block">
              Woori One Foundation
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white tracking-tight leading-[1.1] mb-8"
          >
            희망을 잇고<br className="hidden md:block" />
            <span className="text-stone-300 font-light">내일을 만듭니다</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            className="text-stone-300 text-lg md:text-xl lg:text-2xl max-w-2xl font-light leading-relaxed mb-12"
          >
            상처받은 마음을 보듬고, 스스로 일어설 수 있는<br className="hidden md:block" /> 든든한 버팀목이 되겠습니다.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
          >
            <button
              onClick={() => setView("support", "fund")}
              className="group relative overflow-hidden px-8 md:px-10 py-4 md:py-5 bg-white text-stone-950 rounded-none border border-transparent hover:border-amber-500 transition-all duration-500 shadow-2xl"
            >
              <div className="absolute inset-0 w-0 bg-amber-600 transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
              <span className="relative z-10 font-bold text-lg lg:text-xl tracking-wider flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                후원 참여하기 <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs tracking-widest uppercase font-medium">Scroll</span>
          <div className="w-px h-12 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/80 animate-[scrollDown_2s_ease-in-out_infinite]" />
          </div>
        </motion.div>
      </section>

      {/* 2. Core Values - Elegant Typography & Grid */}
      <section className="py-24 lg:py-40 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 lg:gap-12"
        >
          <div className="max-w-3xl">
            <h2 className="text-amber-700 font-semibold tracking-[0.2em] text-sm lg:text-base uppercase mb-4 lg:mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-amber-700/50"></span>
              Our Core Values
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight">
              우리가 지켜가는<br />변화의 약속
            </h3>
          </div>
          <p className="text-stone-500 text-lg lg:text-xl max-w-md font-light leading-relaxed pb-2">
            단순한 지원을 넘어 개인의 온전한 회복과 지속 가능한 자립을 지향합니다.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {[
            { title: "희망 나눔", desc: "조건 없는 나눔으로 따뜻한 위로와 새로운 희망을 전합니다.", Icon: Heart },
            { title: "자립 지원", desc: "스스로 설 수 있도록 교육과 실질적인 인프라를 제공합니다.", Icon: Handshake },
            { title: "치유 멘토링", desc: "상처를 깊이 보듬고 새로운 출발을 함께 응원합니다.", Icon: MessageCircle },
            { title: "문화 예술", desc: "예술을 매개로 내면의 아름다움과 정서적 안정을 회복합니다.", Icon: Music },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeUp}
              className="group cursor-pointer bg-white p-8 lg:p-10 border border-stone-100 hover:border-amber-200 hover:shadow-xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="w-16 h-16 border border-stone-200 rounded-full flex items-center justify-center mb-8 group-hover:border-amber-600 group-hover:bg-amber-600 transition-all duration-500">
                <item.Icon className="w-6 h-6 text-stone-400 group-hover:text-white transition-colors duration-500 stroke-[1.5]" />
              </div>
              <h4 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-amber-700 transition-colors duration-300">
                {item.title}
              </h4>
              <p className="text-stone-500 text-base lg:text-lg leading-relaxed font-light mt-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. Latest Highlights - Magazine Style */}
      <section className="py-24 lg:py-40 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="flex justify-between items-end mb-16 border-b border-stone-200 pb-8"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
              최근 소식
            </h2>
            <button
              onClick={() => setView("news", "feed")}
              className="text-base font-medium text-stone-500 hover:text-amber-700 transition-colors flex items-center gap-2 group uppercase tracking-[0.1em]"
            >
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Featured Big Item */}
            {galleryItems.length > 0 && (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                onClick={() => setView("news", "feed")}
                className="lg:col-span-7 group cursor-pointer flex flex-col"
              >
                <div className="relative overflow-hidden w-full aspect-[4/3] mb-8 bg-stone-100">
                  <img
                    src={galleryItems[0].img}
                    alt={galleryItems[0].title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 bg-stone-900/90 backdrop-blur-sm text-white px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase">
                    Gallery
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-amber-700 font-medium text-sm tracking-wide">
                    {galleryItems[0].date}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-snug group-hover:text-amber-700 transition-colors duration-300">
                    {galleryItems[0].title}
                  </h3>
                  <p className="text-stone-500 text-lg line-clamp-2 font-light leading-relaxed mt-2">
                    {galleryItems[0].content || "단순한 지원을 넘어 함께 만드는 희망의 현장을 공유합니다."}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Smaller Items & Notices */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              {/* Secondary Visual Item */}
              {galleryItems.length > 1 && (
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeUp}
                  onClick={() => setView("news", "feed")}
                  className="group cursor-pointer flex flex-col gap-5 mb-16 lg:mb-0"
                >
                  <div className="relative overflow-hidden w-full aspect-video bg-stone-100">
                    <img
                      src={galleryItems[1].img}
                      alt={galleryItems[1].title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="text-amber-700 font-medium text-sm tracking-wide mb-2">{galleryItems[1].date}</div>
                    <h3 className="text-2xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors duration-300 leading-snug">
                      {galleryItems[1].title}
                    </h3>
                  </div>
                </motion.div>
              )}

              {/* Minimal Notice List */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                className="border-t border-stone-200 pt-10"
              >
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-2xl font-bold text-stone-900">공지사항</h4>
                  <button onClick={() => setView("news", "notice")} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col">
                  {noticeItems.slice(0, 3).map((notice, idx) => (
                    <div
                      key={idx}
                      onClick={() => setView("news", "notice")}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer py-5 border-b border-stone-100 last:border-0 hover:bg-stone-50 px-2 -mx-2 transition-colors"
                    >
                      <h5 className="text-lg font-medium text-stone-800 group-hover:text-amber-700 transition-colors truncate">
                        {notice.title}
                      </h5>
                      <span className="text-sm text-stone-400 font-light shrink-0">
                        {notice.date}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Transparency & Trust - Deep Contrast */}
      <section className="bg-stone-950 text-white py-24 lg:py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="flex-1"
          >
            <h2 className="text-amber-600 font-medium tracking-[0.2em] text-sm uppercase mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-amber-600/50"></span>
              Transparency
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-8">
              투명하고 정직하게<br />운영합니다
            </h3>
            <p className="text-stone-400 text-lg lg:text-xl font-light leading-relaxed max-w-xl mb-12">
              법정 기부금 단체로서 철저한 이사회 감사와 외부 공시를 통해 보내주신 소중한 마음을 가장 투명하게 관리합니다.
            </p>
            <button
              onClick={() => setView("news", "library")}
              className="inline-flex items-center gap-4 px-8 py-4 border border-stone-700 hover:border-amber-500 text-lg font-medium transition-all duration-500 hover:bg-amber-600 hover:text-white"
            >
              투명공시 자료실 <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <motion.div variants={fadeUp} className="p-10 border border-stone-800 bg-stone-900/40 hover:bg-stone-800/80 transition-colors duration-500 flex flex-col">
              <ShieldCheck className="w-10 h-10 text-stone-500 mb-6 stroke-[1.5]" />
              <h4 className="text-2xl font-bold mb-3">법정 기부금 단체</h4>
              <p className="text-stone-400 font-light leading-relaxed text-base">기획재정부 지정 단체로 연말정산 기부금 영수증이 발급됩니다.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-10 border border-stone-800 bg-stone-900/40 hover:bg-stone-800/80 transition-colors duration-500 flex flex-col">
              <Users className="w-10 h-10 text-stone-500 mb-6 stroke-[1.5]" />
              <h4 className="text-2xl font-bold mb-3">독립적 감사기구</h4>
              <p className="text-stone-400 font-light leading-relaxed text-base">내외부 독립적인 감사를 통해 회계 투명성을 검증받습니다.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. Partners Marquee - Minimal Monotone */}
      <section className="py-20 bg-[#FAFAF9] overflow-hidden relative border-t border-stone-200">
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#FAFAF9] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#FAFAF9] to-transparent z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center mb-12">
           <h4 className="text-stone-400 uppercase tracking-[0.3em] text-xs font-medium">Trusted Partners</h4>
        </div>

        <div className="flex w-max animate-marquee hover:animation-play-state-paused items-center opacity-40 hover:opacity-100 transition-opacity duration-700">
          {[...partners, ...partners, ...partners, ...partners].map(
            (partner, idx) => (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-12 md:px-20 shrink-0 group cursor-pointer"
              >
                <img
                  src={partner.img}
                  alt={partner.name}
                  className="h-10 md:h-12 w-auto grayscale transition-all duration-500 object-contain opacity-70 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </a>
            ),
          )}
        </div>
      </section>
      
      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
`
fs.writeFileSync('src/components/DashboardHome.tsx', code);
