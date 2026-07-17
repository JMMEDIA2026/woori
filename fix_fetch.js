import fs from 'fs';

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');

// I will just replace the whole useEffect block
const newUseEffect = `
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

        const partnersSnapshot = await getDocs(query(collection(db, "partners"), orderBy("order")));
        if (!partnersSnapshot.empty) {
          setPartners(partnersSnapshot.docs.map(doc => doc.data() as any));
        }

        const postsSnapshot = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc")));
        const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        
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
          { id: 1, title: "따뜻한 겨울나기 지원", content: "겨울철 난방비 지원...", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400&auto=format&fit=crop", date: "2024.11.15" },
          { id: 2, title: "청소년 장학금 수여식", content: "장학금 수여식 개최...", img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=400&auto=format&fit=crop", date: "2024.10.20" },
          { id: 3, title: "의료비 지원 캠페인", content: "의료 사각지대 해소...", img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=400&auto=format&fit=crop", date: "2024.09.05" }
        ]);
        setNoticeItems([
          { id: 1, title: "2024년도 하반기 지원사업 안내", date: "2024.11.20" },
          { id: 2, title: "이사회 임원 변동 안내", date: "2024.11.01" },
          { id: 3, title: "결산 공시 안내", date: "2024.10.15" }
        ]);
        setVideoItems([
          { id: 1, title: "우리원 홍보 영상", content: "우리원의 주요 활동을 소개합니다.", img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=400&auto=format&fit=crop", date: "2024.11.20" },
          { id: 2, title: "나눔 캠페인 스케치", content: "따뜻한 나눔의 현장입니다.", img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=400&auto=format&fit=crop", date: "2024.10.15" },
          { id: 3, title: "봉사자 인터뷰", content: "봉사자 분들의 생생한 후기", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop", date: "2024.09.05" }
        ]);
      }
    };
    fetchData();
  }, []);
`;

const regex = /useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/m;
code = code.replace(regex, newUseEffect.trim());

fs.writeFileSync('src/components/DashboardHome.tsx', code);
