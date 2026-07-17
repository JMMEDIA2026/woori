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
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // amber -> blue
  code = code.replace(/amber-50/g, "blue-50");
  code = code.replace(/amber-100/g, "blue-100");
  code = code.replace(/amber-200/g, "blue-200");
  code = code.replace(/amber-300/g, "blue-300");
  code = code.replace(/amber-400/g, "blue-400");
  code = code.replace(/amber-500/g, "blue-500");
  code = code.replace(/amber-600/g, "blue-600");
  code = code.replace(/amber-700/g, "blue-700");
  code = code.replace(/amber-800/g, "blue-800");
  code = code.replace(/amber-900/g, "blue-900");
  code = code.replace(/amber-950/g, "blue-950");
  
  // stone -> slate
  code = code.replace(/stone-50/g, "slate-50");
  code = code.replace(/stone-100/g, "slate-100");
  code = code.replace(/stone-200/g, "slate-200");
  code = code.replace(/stone-300/g, "slate-300");
  code = code.replace(/stone-400/g, "slate-400");
  code = code.replace(/stone-500/g, "slate-500");
  code = code.replace(/stone-600/g, "slate-600");
  code = code.replace(/stone-700/g, "slate-700");
  code = code.replace(/stone-800/g, "slate-800");
  code = code.replace(/stone-900/g, "slate-900");
  code = code.replace(/stone-950/g, "slate-950");
  
  // Custom Hex Replace
  code = code.replace(/bg-\[#FAFAF9\]/g, "bg-slate-50");
  code = code.replace(/from-\[#FAFAF9\]/g, "from-slate-50");
  code = code.replace(/bg-\[#1a1a1a\]/g, "bg-slate-950");

  fs.writeFileSync(file, code);
}
