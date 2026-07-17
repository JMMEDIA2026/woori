import fs from 'fs';

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');
const searchString = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iODAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY0NzQ4YiI+64Ko67aB7ZWY64KY7J6s64uoPC90ZXh0Pjwvc3ZnPg=='http://www.w3.org/2000/svg' width='200' height='80'><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2364748b'>남북하나재단</text></svg>`;

const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#64748b">남북하나재단</text></svg>`;
const b64 = Buffer.from(svgString).toString('base64');
const dataUri = `data:image/svg+xml;base64,${b64}`;

code = code.replace(searchString, dataUri);
fs.writeFileSync('src/components/DashboardHome.tsx', code);
