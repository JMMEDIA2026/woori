import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') && !file.includes('DashboardHome') && !file.includes('Navigation') && !file.includes('App.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  
  code = code.replace(/text-rose-400/g, "text-amber-500");
  code = code.replace(/text-rose-500/g, "text-amber-600");
  code = code.replace(/bg-rose-500/g, "bg-amber-600");
  code = code.replace(/bg-rose-50/g, "bg-stone-50");
  code = code.replace(/border-rose-200/g, "border-stone-200");
  code = code.replace(/border-rose-100/g, "border-stone-100");
  code = code.replace(/text-rose-600/g, "text-stone-900");
  code = code.replace(/ring-rose-400/g, "ring-amber-500");

  fs.writeFileSync(file, code);
}
