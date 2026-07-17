import fs from 'fs';

let code = fs.readFileSync('src/components/Navigation.tsx', 'utf-8');

code = code.replace(
  '{ id: "feed", label: "단체 갤러리", desc: "생생한 현장 스케치" },',
  '{ id: "feed", label: "단체 갤러리", desc: "생생한 현장 스케치" },\n      { id: "video", label: "영상 갤러리", desc: "활동 영상 모음" },'
);

fs.writeFileSync('src/components/Navigation.tsx', code);
