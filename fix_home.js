import fs from 'fs';

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');

const startIndex = code.indexOf('const partners = [');
if (startIndex !== -1) {
    const endIndex = code.indexOf('];', startIndex) + 2;
    const oldPartners = code.substring(startIndex, endIndex);
    const newPartners = `const defaultPartners = [
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
    img: "https://via.placeholder.com/200x80/ffffff/94a3b8?text=%EB%82%A8%EB%B6%81%ED%95%98%EB%82%98%EC%9E%AC%EB%8B%A8",
    url: "https://www.koreahana.or.kr/",
  },
  {
    name: "대한적십자사",
    img: "https://via.placeholder.com/200x80/ffffff/94a3b8?text=%EB%8C%80%ED%95%9C%EC%A0%81%EC%8B%AD%EC%9E%90%EC%82%AC",
    url: "https://www.redcross.or.kr/",
  },
  {
    name: "행정안전부",
    img: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_of_the_Ministry_of_the_Interior_and_Safety.svg",
    url: "https://www.mois.go.kr/",
  },
  {
    name: "사회복지공동모금회",
    img: "https://via.placeholder.com/200x80/ffffff/94a3b8?text=%EC%82%AC%ED%9A%8C%EB%B3%B5%EC%A7%80%EA%B3%B5%EB%8F%99%EB%AA%A8%EA%B8%88%ED%9A%8C",
    url: "https://www.chest.or.kr/",
  },
];`;
    code = code.replace(oldPartners, newPartners);
}

// Add state for partners in DashboardHome
const stateStart = code.indexOf('const [galleryItems, setGalleryItems] = useState');
if (!code.includes('const [partners, setPartners]')) {
  const partnersState = `const [partners, setPartners] = useState<{name: string, img: string, url: string}[]>([]);\n  `;
  code = code.slice(0, stateStart) + partnersState + code.slice(stateStart);
}

// Add localStorage read in useEffect
const useEffectStart = code.indexOf('setGalleryItems(galleries.slice(0, 3));');
if (!code.includes('const storedPartners')) {
  const partnersLoad = `
    const storedPartners = localStorage.getItem("admin_partners");
    if (storedPartners) {
      setPartners(JSON.parse(storedPartners));
    } else {
      setPartners(defaultPartners);
    }
    `;
  code = code.slice(0, useEffectStart) + partnersLoad + code.slice(useEffectStart);
}

fs.writeFileSync('src/components/DashboardHome.tsx', code);
