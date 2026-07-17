import fs from 'fs';

let code = fs.readFileSync('src/page/AdminDashboard.tsx', 'utf-8');

const regex = /const fetchData = async \(\) => \{[\s\S]*?console\.error\("Error fetching data: ", error\);\n    \}\n  \};/m;

const newFetch = `
  const fetchData = async () => {
    try {
      const bannerDoc = await getDoc(doc(db, "banners", "main"));
      if (bannerDoc.exists()) {
        const data = bannerDoc.data();
        setFeatureImg1(data.img1 || "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop");
        setFeatureImg2(data.img2 || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop");
      } else {
        setFeatureImg1("https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop");
        setFeatureImg2("https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop");
      }

      const partnersSnapshot = await getDocs(query(collection(db, "partners"), orderBy("order")));
      const partnersData = partnersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setPartners(partnersData.length > 0 ? partnersData : []);

      const postsSnapshot = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc")));
      setExistingPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching data: ", error);
      // fallback so we don't show empty inputs if offline during dev
      if(!featureImg1) setFeatureImg1("https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop");
      if(!featureImg2) setFeatureImg2("https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop");
    }
  };
`;

code = code.replace(regex, newFetch.trim());
fs.writeFileSync('src/page/AdminDashboard.tsx', code);
