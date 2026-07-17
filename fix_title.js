import fs from 'fs';

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');
code = code.replace(/<h3 className="text-xl font-bold text-stone-900 tracking-tight">\s*단체 갤러리\s*<\/h3>/, '<h3 className="text-xl font-bold text-stone-900 tracking-tight">단체 갤러리 최신글</h3>');
fs.writeFileSync('src/components/DashboardHome.tsx', code);
