const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('src/components/SiteGallery.tsx', 'utf8');

// replace activeMedia state
content = content.replace(
  /const \[activeMedia, setActiveMedia\] = useState<GalleryMedia \| null>\(null\);/,
  'const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);'
);

// Remove modal logic
content = content.replace(
  /\{\/\* Video \/ Photo overlay popup lightbox \*\/\}(.|\n)*?\n      \}\)/,
  ''
);

// Change onClick behavior
const searchString = `              onClick={() => setActiveMedia(item)}`;
const replaceString = `              onClick={() => {
                if (isVideo && item.videoUrl) {
                  // extract video ID to replace inline
                  const match = item.videoUrl.match(/embed\\/([^?]+)/);
                  if (match && match[1]) {
                    setPlayingVideoId(match[1]);
                  }
                }
              }}`;

content = content.replace(searchString, replaceString);

// Change thumbnail render
const imgRegex = /\{\/\* Thumbnail \*\/\}\n              <div className="relative aspect-video bg-slate-100 overflow-hidden">/g;

content = content.replace(imgRegex, `{/* Thumbnail */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                {(isVideo && item.videoUrl && playingVideoId && item.videoUrl.includes(playingVideoId)) ? (
                  <iframe
                    src={item.videoUrl + "&autoplay=1"}
                    title={item.title}
                    className="absolute inset-0 w-full h-full border-0 z-10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : null}`);

fs.writeFileSync('src/components/SiteGallery.tsx', content);
console.log('Done SiteGallery');
