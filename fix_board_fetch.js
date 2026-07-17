import fs from 'fs';

// SiteGallery.tsx
let galleryCode = fs.readFileSync('src/page/SiteGallery.tsx', 'utf-8');
const galleryRegex = /const fetchGallery = async \(\) => \{[\s\S]*?console\.error\("Error fetching gallery:", error\);\n      \}\n    \};\n    fetchGallery\(\);/m;
const galleryNewFetch = `
    const fetchGallery = async () => {
      let hasData = false;
      try {
        const q = query(collection(db, "posts"), where("type", "==", "gallery"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a: any, b: any) => b.createdAt - a.createdAt);
        if (data.length > 0) {
          setPosts(data);
          hasData = true;
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
      
      if (!hasData) {
         setPosts([
             { id: 1, title: "우리원 봉사단과 함께하는 사랑의 연탄 나눔 및 밑반찬 배달", date: "2024.11.16", author: "관리자", views: 245, img: "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop", content: "추운 겨울을 맞아 지역 사회의 소외된 이웃들에게 따뜻한 온기를 전하고자 사랑의 연탄 나눔과 밑반찬 배달 봉사활동을 진행했습니다." },
             { id: 2, title: "탈북민 자립 공방 '희망을 빚다' 일일 체험 클래스", date: "2024.11.10", author: "관리자", views: 182, img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600&auto=format&fit=crop", content: "자립 공방에서 수공예품 제작 체험 클래스를 성황리에 마쳤습니다." },
             { id: 3, title: "가을맞이 지역주민과 함께하는 바자회 현장 스케치", date: "2024.10.25", author: "관리자", views: 310, img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop", content: "바자회 수익금은 전액 소외계층을 위해 쓰일 예정입니다." }
          ]);
      }
    };
    fetchGallery();
`;
galleryCode = galleryCode.replace(galleryRegex, galleryNewFetch.trim());
fs.writeFileSync('src/page/SiteGallery.tsx', galleryCode);

// CommunityBoard.tsx
let boardCode = fs.readFileSync('src/page/CommunityBoard.tsx', 'utf-8');
const boardRegex = /const fetchNotices = async \(\) => \{[\s\S]*?console\.error\("Error fetching notices:", error\);\n      \}\n    \};\n    fetchNotices\(\);/m;
const boardNewFetch = `
    const fetchNotices = async () => {
      if (isQnA) {
        setPosts(INITIAL_QNA);
        return;
      }
      let hasData = false;
      try {
        const q = query(collection(db, "posts"), where("type", "==", "notice"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a: any, b: any) => b.createdAt - a.createdAt);
        
        if (data.length > 0) {
          setPosts(data);
          hasData = true;
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
      if (!hasData) {
        setPosts([
             { id: 1, type: "notice", title: "[필독] 2024년도 하반기 지원사업 안내", date: "2024.11.19", author: "관리자", views: 124, content: "2024년도 하반기 지원사업 안내입니다." },
             { id: 2, type: "notice", title: "정기 후원금 영수증 발급 안내", date: "2024.11.18", author: "관리자", views: 98, content: "연말정산을 위한 기부금 영수증 발급 방법 안내" },
          ]);
      }
    };
    fetchNotices();
`;
boardCode = boardCode.replace(boardRegex, boardNewFetch.trim());
fs.writeFileSync('src/page/CommunityBoard.tsx', boardCode);
