import fs from 'fs';

let code = fs.readFileSync('src/page/AdminDashboard.tsx', 'utf-8');

// Add radio button for video
code = code.replace(
  '<span className="font-bold text-stone-700">공지사항</span>\n              </label>',
  '<span className="font-bold text-stone-700">공지사항</span>\n              </label>\n              <label className="flex items-center gap-2 cursor-pointer">\n                <input\n                  type="radio"\n                  value="video"\n                  checked={uploadType === "video"}\n                  onChange={(e) => setUploadType(e.target.value)}\n                  className="w-4 h-4 text-emerald-500 border-stone-300 focus:ring-emerald-400"\n                />\n                <span className="font-bold text-stone-700">영상</span>\n              </label>'
);

// Add styling for video in the list
code = code.replace(
  '{post.type === \'gallery\' ? \'bg-emerald-100 text-emerald-700\' : \'bg-blue-100 text-blue-700\'}',
  '{post.type === \'gallery\' ? \'bg-emerald-100 text-emerald-700\' : post.type === \'video\' ? \'bg-purple-100 text-purple-700\' : \'bg-blue-100 text-blue-700\'}'
);

code = code.replace(
  '{post.type === \'gallery\' ? \'갤러리\' : \'공지사항\'}',
  '{post.type === \'gallery\' ? \'갤러리\' : post.type === \'video\' ? \'영상\' : \'공지사항\'}'
);

fs.writeFileSync('src/page/AdminDashboard.tsx', code);
