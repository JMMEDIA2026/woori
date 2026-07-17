import fs from 'fs';

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');

// 1. Add videoItems state
code = code.replace(
  'const [noticeItems, setNoticeItems] = useState<any[]>([]);',
  'const [noticeItems, setNoticeItems] = useState<any[]>([]);\n  const [videoItems, setVideoItems] = useState<any[]>([]);'
);

// 2. Fetch video items
const postsFetchStr = 'const notices = posts.filter((p) => p.type === "notice").slice(0, 3);';
const postsFetchReplacement = `const notices = posts.filter((p) => p.type === "notice").slice(0, 3);
        const videos = posts.filter((p) => p.type === "video").slice(0, 3);
        
        if (videos.length > 0) {
          setVideoItems(videos);
        } else {
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
        }`;

code = code.replace(postsFetchStr, postsFetchReplacement);

// 3. Add Video section to the render
const gallerySectionStr = '{/* Latest Gallery Section */}';
const gallerySectionReplacement = `{/* Latest Video Section */}
      <section className="w-full">
        {videoItems.length > 0 && (
          <div className="bg-white rounded-[2rem] border border-stone-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-xl font-bold text-stone-900 tracking-tight">영상 갤러리 최신글</h3>
                </div>
                <p className="text-sm text-stone-500">
                  생생한 영상으로 만나는 우리의 이야기
                </p>
              </div>
              <button
                onClick={() => setView("news", "video")}
                className="text-xs font-bold text-stone-400 hover:text-indigo-500 transition-colors flex items-center gap-1"
              >
                더보기 <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videoItems.map((item, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-stone-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden relative shrink-0">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                      </div>
                    </div>
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

      {/* Latest Gallery Section */}`;

code = code.replace(gallerySectionStr, gallerySectionReplacement);

fs.writeFileSync('src/components/DashboardHome.tsx', code);
