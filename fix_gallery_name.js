import fs from 'fs';

let dashCode = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');
dashCode = dashCode.replace(/활동 갤러리/g, '단체 갤러리');
fs.writeFileSync('src/components/DashboardHome.tsx', dashCode);

let navCode = fs.readFileSync('src/components/Navigation.tsx', 'utf-8');
navCode = navCode.replace(/활동 갤러리/g, '단체 갤러리');
fs.writeFileSync('src/components/Navigation.tsx', navCode);

let galleryCode = fs.readFileSync('src/page/SiteGallery.tsx', 'utf-8');
galleryCode = galleryCode.replace(/활동 갤러리/g, '단체 갤러리');
fs.writeFileSync('src/page/SiteGallery.tsx', galleryCode);
