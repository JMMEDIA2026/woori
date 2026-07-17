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
    
    // We replace using a function to avoid double-bumping
    code = code.replace(/\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|\[10px\])\b/g, (match, size) => {
      switch (size) {
        case '[10px]': return 'text-xs';
        case 'xs': return 'text-sm';
        case 'sm': return 'text-base';
        case 'base': return 'text-lg';
        case 'lg': return 'text-xl';
        case 'xl': return 'text-2xl';
        case '2xl': return 'text-3xl';
        case '3xl': return 'text-4xl';
        case '4xl': return 'text-5xl';
        case '5xl': return 'text-6xl';
        case '6xl': return 'text-7xl';
        default: return match;
      }
    });

    fs.writeFileSync(file, code);
  }
}
