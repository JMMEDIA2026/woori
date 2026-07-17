import fs from 'fs';

let dashCode = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');
dashCode = dashCode.replace(/setView\("news", "gallery"\)/g, 'setView("news", "feed")');
fs.writeFileSync('src/components/DashboardHome.tsx', dashCode);
