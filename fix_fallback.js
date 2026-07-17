import fs from 'fs';

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');

const fallbackCode = `
const fetchFallbackData = () => {
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
    }
  ]);
  setNoticeItems([
    { id: 1, title: "2024년도 하반기 지원사업 안내", date: "2024.11.20" },
    { id: 2, title: "이사회 임원 변동 안내", date: "2024.11.01" },
    { id: 3, title: "결산 공시 안내", date: "2024.10.15" }
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
    }
  ]);
};
`;

code = code.replace(
  'const fetchData = async () => {\n      try {',
  `${fallbackCode}\n    const fetchData = async () => {\n      try {`
);

// We need to remove the inline fallbacks from the try block to avoid duplication
// Let's just catch and run fallback
code = code.replace(
  /} catch \(error\) {/g,
  `} catch (error) {\n        console.error("Error fetching data:", error);\n        fetchFallbackData();\n      } finally {\n        if (galleryItems.length === 0) fetchFallbackData();\n      }`
);

// Actually, wait, galleryItems is in state, so closure has empty array. The finally block is not perfectly safe.
// Instead of complex AST replacements, let's just make it simple: if error, call fetchFallbackData().
// But we already have static fallbacks if empty. The issue is if the query FAILS, the fallback isn't hit.
