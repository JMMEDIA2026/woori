// 로컬 확인용 Node 서버 (Cloudflare 배포에는 쓰이지 않습니다).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { search } from './src/numbers.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(dir, 'public');
const PORT = process.env.PORT || 3000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/numbers') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({ example: true, numbers: search(url.searchParams.get('country'), url.searchParams.get('area')) }));
  }
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC + path.sep) || path.basename(file) === '_headers') { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('페이지를 찾을 수 없습니다.'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(data);
  });
}).listen(PORT, () => console.log('http://localhost:' + PORT));
