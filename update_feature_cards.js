import fs from 'fs';

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');

const regex = /\{\/\* Main Feature Cards \*\/\}\s*<section className="grid grid-cols-1 md:grid-cols-2 gap-6">[\s\S]*?(?=\{\/\* Board & Notice Section \*\/\})/m;

const replacement = `{/* Main Feature Cards (Latest Gallery & Video) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Gallery */}
        {galleryItems.length > 0 && (
          <div 
            onClick={() => setView("news", "feed")}
            className="group relative overflow-hidden rounded-[2rem] bg-white border border-rose-100 flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer"
          >
            <div className="h-64 w-full overflow-hidden relative shrink-0">
              <img
                src={galleryItems[0].img || featureImg1}
                alt={galleryItems[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-sm font-bold uppercase tracking-wider border border-rose-400/50 flex items-center gap-1.5">
                  <ImageIcon className="w-3 h-3" />
                  단체 갤러리 최신글
                </span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-rose-50/30">
              <div className="text-sm font-bold text-rose-500 mb-2">{galleryItems[0].date}</div>
              <h3 className="text-2xl font-black text-stone-900 mb-3 tracking-tight line-clamp-2">
                {galleryItems[0].title}
              </h3>
              <p className="text-stone-500 leading-relaxed flex-1 line-clamp-2">
                {galleryItems[0].content}
              </p>
              <div
                className="mt-6 flex items-center gap-2 text-rose-500 font-bold group-hover:translate-x-1 transition-transform self-start"
              >
                갤러리 바로가기 <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Latest Video */}
        {videoItems.length > 0 && (
          <div 
            onClick={() => setView("news", "video")}
            className="group relative overflow-hidden rounded-[2rem] bg-white border border-indigo-100 flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer"
          >
            <div className="h-64 w-full overflow-hidden relative shrink-0">
              <img
                src={videoItems[0].img || featureImg2}
                alt={videoItems[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform shadow-xl">
                   <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                 </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-indigo-500/80 backdrop-blur-md text-white text-sm font-bold uppercase tracking-wider border border-indigo-400/50 flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  영상 갤러리 최신글
                </span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-indigo-50/30">
              <div className="text-sm font-bold text-indigo-500 mb-2">{videoItems[0].date}</div>
              <h3 className="text-2xl font-black text-stone-900 mb-3 tracking-tight line-clamp-2">
                {videoItems[0].title}
              </h3>
              <p className="text-stone-500 leading-relaxed flex-1 line-clamp-2">
                {videoItems[0].content}
              </p>
              <div
                className="mt-6 flex items-center gap-2 text-indigo-500 font-bold group-hover:translate-x-1 transition-transform self-start"
              >
                영상 보러가기 <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </section>
      
      `;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/DashboardHome.tsx', code);
