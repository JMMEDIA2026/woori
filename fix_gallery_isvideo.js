import fs from 'fs';

let code = fs.readFileSync('src/page/SiteGallery.tsx', 'utf-8');

// 1. Add isVideo to props
code = code.replace(
  'export default function SiteGallery() {',
  'export default function SiteGallery({ isVideo = false }: { isVideo?: boolean }) {'
);

// 2. Change title based on isVideo
code = code.replace(
  '<h2 className="text-3xl font-black text-stone-900 tracking-tight">단체 갤러리</h2>',
  '<h2 className="text-3xl font-black text-stone-900 tracking-tight">{isVideo ? "영상 갤러리" : "단체 갤러리"}</h2>'
);

code = code.replace(
  '재단의 생생한 활동 현장을 사진과 함께 전해드립니다.',
  '{isVideo ? "재단의 생생한 활동 현장을 영상으로 전해드립니다." : "재단의 생생한 활동 현장을 사진과 함께 전해드립니다."}'
);

// 3. Update query to fetch "video" if isVideo is true
code = code.replace(
  'const q = query(collection(db, "posts"), where("type", "==", "gallery"));',
  'const q = query(collection(db, "posts"), where("type", "==", isVideo ? "video" : "gallery"));'
);

// 4. Update the fallback logic inside SiteGallery
// It's using gallery fallbacks, but we should use video fallbacks if isVideo is true.
const regexFallback = /if \(\!hasData\) \{[\s\S]*?\]\);\n      \}/m;
const newFallback = `if (!hasData) {
         setPosts(isVideo ? [
             { id: 1, title: "우리원 홍보 영상", date: "2024.11.20", author: "관리자", views: 245, img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=600&auto=format&fit=crop", content: "우리원의 주요 활동을 소개합니다." },
             { id: 2, title: "나눔 캠페인 스케치", date: "2024.10.15", author: "관리자", views: 182, img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=600&auto=format&fit=crop", content: "따뜻한 나눔의 현장입니다." },
             { id: 3, title: "봉사자 인터뷰", date: "2024.09.05", author: "관리자", views: 310, img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop", content: "봉사자 분들의 생생한 후기" }
          ] : [
             { id: 1, title: "우리원 봉사단과 함께하는 사랑의 연탄 나눔 및 밑반찬 배달", date: "2024.11.16", author: "관리자", views: 245, img: "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop", content: "추운 겨울을 맞아 지역 사회의 소외된 이웃들에게 따뜻한 온기를 전하고자 사랑의 연탄 나눔과 밑반찬 배달 봉사활동을 진행했습니다." },
             { id: 2, title: "탈북민 자립 공방 '희망을 빚다' 일일 체험 클래스", date: "2024.11.10", author: "관리자", views: 182, img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600&auto=format&fit=crop", content: "자립 공방에서 수공예품 제작 체험 클래스를 성황리에 마쳤습니다." },
             { id: 3, title: "가을맞이 지역주민과 함께하는 바자회 현장 스케치", date: "2024.10.25", author: "관리자", views: 310, img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop", content: "바자회 수익금은 전액 소외계층을 위해 쓰일 예정입니다." }
          ]);
      }`;
code = code.replace(regexFallback, newFallback);

// 5. If isVideo is true, display a play button overlay on images, same as in DashboardHome
const imgRegex = /<img src=\{post\.img\} alt=\{post\.title\} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" \/>/g;
const newImg = `<img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 {isVideo && (
                    <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                      </div>
                    </div>
                 )}`;
code = code.replace(imgRegex, newImg);

// Re-fetch when isVideo changes
code = code.replace(
  'fetchGallery();\n  }, []);',
  'fetchGallery();\n  }, [isVideo]);'
);

fs.writeFileSync('src/page/SiteGallery.tsx', code);
