import fs from 'fs';

// Helper to replace via.placeholder.com with reliable unsplash / wiki images
const replacements = [
  {
    regex: /https:\/\/via\.placeholder\.com\/600x400\?text=Growth\+and\+Independence/g,
    replace: "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop"
  },
  {
    regex: /https:\/\/via\.placeholder\.com\/600x400\?text=Sharing\+and\+Love/g,
    replace: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=600&auto=format&fit=crop"
  },
  {
    regex: /https:\/\/via\.placeholder\.com\/400x300/g,
    replace: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400&auto=format&fit=crop"
  },
  {
    regex: /https:\/\/via\.placeholder\.com\/600x400\?text=Gallery\+1/g,
    replace: "https://images.unsplash.com/photo-1593113563332-f1488c282124?q=80&w=600&auto=format&fit=crop"
  },
  {
    regex: /https:\/\/via\.placeholder\.com\/600x400\?text=Gallery\+2/g,
    replace: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=600&auto=format&fit=crop"
  },
  {
    regex: /https:\/\/via\.placeholder\.com\/600x400\?text=Gallery\+3/g,
    replace: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop"
  },
  {
    regex: /https:\/\/via\.placeholder\.com\/200x80\/ffffff\/94a3b8\?text=%EB%82%A8%EB%B6%81%ED%95%98%EB%82%98%EC%9E%AC%EB%8B%A8/g,
    replace: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='80'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b'>남북하나재단</text></svg>"
  },
  {
    regex: /https:\/\/via\.placeholder\.com\/200x80\/ffffff\/94a3b8\?text=%EB%8C%80%ED%95%9C%EC%A0%81%EC%8B%AD%EC%9E%90%EC%82%AC/g,
    replace: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Emblem_of_the_Red_Cross_of_Korea.svg/512px-Emblem_of_the_Red_Cross_of_Korea.svg.png"
  },
  {
    regex: /https:\/\/via\.placeholder\.com\/200x80\/ffffff\/94a3b8\?text=%EC%82%AC%ED%9A%8C%EB%B3%B5%EC%A7%80%EA%B3%B5%EB%8F%99%EB%AA%A8%EA%B8%88%ED%9A%8C/g,
    replace: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Community_Chest_of_Korea_logo.svg"
  }
];

const filesToUpdate = [
  'src/components/DashboardHome.tsx',
  'src/page/AdminDashboard.tsx',
  'src/page/SiteGallery.tsx'
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    for (const { regex, replace } of replacements) {
      code = code.replace(regex, replace);
    }
    
    // Also change the default images array in DashboardHome slightly to give variety
    if (file === 'src/components/DashboardHome.tsx') {
        const idx1 = code.indexOf(`{ id: 2, title: "청소년 장학금 수여식", content: "장학금 수여식 개최...", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400&auto=format&fit=crop"`);
        if(idx1 !== -1) {
            code = code.replace(
                `{ id: 2, title: "청소년 장학금 수여식", content: "장학금 수여식 개최...", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400&auto=format&fit=crop"`,
                `{ id: 2, title: "청소년 장학금 수여식", content: "장학금 수여식 개최...", img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=400&auto=format&fit=crop"`
            );
        }
        const idx2 = code.indexOf(`{ id: 3, title: "의료비 지원 캠페인", content: "의료 사각지대 해소...", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400&auto=format&fit=crop"`);
        if(idx2 !== -1) {
            code = code.replace(
                `{ id: 3, title: "의료비 지원 캠페인", content: "의료 사각지대 해소...", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=400&auto=format&fit=crop"`,
                `{ id: 3, title: "의료비 지원 캠페인", content: "의료 사각지대 해소...", img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=400&auto=format&fit=crop"`
            );
        }
    }

    fs.writeFileSync(file, code);
  }
}
