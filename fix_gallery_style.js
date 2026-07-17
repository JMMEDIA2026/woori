import fs from 'fs';

let code = fs.readFileSync('src/components/DashboardHome.tsx', 'utf-8');

code = code.replace(
  'className="grid grid-cols-1 sm:grid-cols-3 gap-4"',
  'className="grid grid-cols-1 md:grid-cols-3 gap-6"'
);

code = code.replace(
  'className="h-32 w-full overflow-hidden relative shrink-0"',
  'className="aspect-[4/3] w-full overflow-hidden relative shrink-0"'
);

// We can also make the gallery section a bit prettier by removing bg-stone-50 if it's there
code = code.replace(
  'className="p-4 flex flex-col flex-1 bg-stone-50 group-hover:bg-indigo-50/30 transition-colors"',
  'className="p-6 flex flex-col flex-1 bg-white group-hover:bg-indigo-50/10 transition-colors border-t border-stone-100"'
);

code = code.replace(
  'className="text-sm font-bold text-stone-900 mb-1 line-clamp-1"',
  'className="text-base font-bold text-stone-900 mb-2 line-clamp-2 leading-snug"'
);

fs.writeFileSync('src/components/DashboardHome.tsx', code);
