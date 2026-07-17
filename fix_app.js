import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/selection:bg-rose-500\/20/g, "selection:bg-amber-900 selection:text-amber-50");
code = code.replace(/text-rose-400/g, "text-amber-500");
code = code.replace(/text-rose-500/g, "text-amber-600");
code = code.replace(/bg-rose-500/g, "bg-amber-600");
code = code.replace(/bg-rose-50/g, "bg-stone-50");
code = code.replace(/border-rose-200/g, "border-stone-200");
code = code.replace(/text-rose-600/g, "text-stone-900");

fs.writeFileSync('src/App.tsx', code);
