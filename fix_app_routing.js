import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /\(subView === "library" \? \([\s\S]*?<SiteGallery \/>\s*\) : \(\s*<CommunityBoard activeSubSection=\{subView\} \/>\s*\)\)\}/m;

const newRouting = '(subView === "library" ? (\n' +
'                  <AcademicLibrary />\n' +
'                ) : subView === "feed" ? (\n' +
'                  <SiteGallery />\n' +
'                ) : subView === "video" ? (\n' +
'                  <SiteGallery isVideo={true} />\n' +
'                ) : (\n' +
'                  <CommunityBoard activeSubSection={subView} />\n' +
'                ))}';

code = code.replace(regex, newRouting);
fs.writeFileSync('src/App.tsx', code);
