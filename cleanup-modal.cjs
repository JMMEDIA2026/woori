const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('src/components/DashboardHome.tsx', 'utf8');

// Replace state
content = content.replace(
  /const \[modalVideoId, setModalVideoId\] = useState<string \| null>\(null\);\n  const \[modalVideoTitle, setModalVideoTitle\] = useState<string>\(""\);/,
  'const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);'
);

// Remove modal logic
content = content.replace(
  /\{\/\* Dynamic YouTube Video Modal Popup overlay \*\/\}(.|\n)*?\n      \}\)/,
  ''
);

// Replace onClick and thumbnail logic
const searchString = `              onClick={() => {
                setModalVideoId(act.youtubeId);
                setModalVideoTitle(act.title);
              }}`;

const replacementString = `              onClick={() => {
                setPlayingVideoId(act.youtubeId);
              }}`;

content = content.replace(searchString, replacementString);

content = content.replace(/\{\/\* Media Thumbnail Container with play hover effects \*\/\}\n              <div className="relative aspect-\[16\/9\] bg-slate-900 overflow-hidden">/g, `{/* Media Thumbnail Container with play hover effects */}
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                {playingVideoId === act.youtubeId ? (
                  <iframe
                    src={\`https://www.youtube.com/embed/\${act.youtubeId}?autoplay=1&rel=0\`}
                    title={act.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0 z-10"
                  />
                ) : null}`);

fs.writeFileSync('src/components/DashboardHome.tsx', content);
console.log('Done DashboardHome');
