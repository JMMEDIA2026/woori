import fs from 'fs';

const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#64748b">남북하나재단</text></svg>`;
const b64 = Buffer.from(svgString).toString('base64');
const dataUri = `data:image/svg+xml;base64,${b64}`;

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');
code = code.replace(/data:image\/svg\+xml;utf8,[^'"]+/, dataUri);
fs.writeFileSync('src/components/DashboardHome.tsx', code);
