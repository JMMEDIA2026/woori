import fs from 'fs';

const files = [
  'src/components/DashboardHome.tsx',
  'src/components/Navigation.tsx',
  'src/page/SiteGallery.tsx',
  'src/page/CommunityBoard.tsx',
  'src/App.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf-8');
    
    // Reverse the bump mapping
    code = code.replace(/\btext-(sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b/g, (match, size) => {
      switch (size) {
        case 'sm': return 'text-xs'; // Wait, [10px] is lost, let's just use xs
        case 'base': return 'text-sm';
        case 'lg': return 'text-base';
        case 'xl': return 'text-lg';
        case '2xl': return 'text-xl';
        case '3xl': return 'text-2xl';
        case '4xl': return 'text-3xl';
        case '5xl': return 'text-4xl';
        case '6xl': return 'text-5xl';
        case '7xl': return 'text-6xl';
        default: return match;
      }
    });

    fs.writeFileSync(file, code);
  }
}
