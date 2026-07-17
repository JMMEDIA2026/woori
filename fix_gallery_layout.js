import fs from 'fs';

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');

// The current structure has Board & Notice Section as a single grid with 2 columns.
// We should split them into two sections.

const splitRegex = /<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">([\s\S]*?)<\/section>/;
const match = code.match(splitRegex);

if (match) {
  const content = match[1];
  // content contains both the notice div and the gallery div.
  // We can separate them by finding `{galleryItems.length > 0 && (`
  
  const galleryStart = content.indexOf('{galleryItems.length > 0 && (');
  if (galleryStart !== -1) {
    const noticeContent = content.substring(0, galleryStart);
    const galleryContent = content.substring(galleryStart);
    
    const newLayout = `
      {/* Board & Notice Section */}
      <section className="max-w-4xl mx-auto w-full">
        ${noticeContent}
      </section>

      {/* Latest Gallery Section */}
      <section className="w-full">
        ${galleryContent}
      </section>
    `;
    
    code = code.replace(match[0], newLayout);
    fs.writeFileSync('src/components/DashboardHome.tsx', code);
  }
}
