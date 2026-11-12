// Cloudflare Worker: /api/numbers 만 처리하고, 나머지는 정적 자산(public/)이 응답합니다.
import { search } from './numbers.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/numbers') {
      if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method Not Allowed', { status: 405 });
      const numbers = search(url.searchParams.get('country'), url.searchParams.get('area'));
      return Response.json({ example: true, numbers }, { headers: { 'Cache-Control': 'no-store' } });
    }
    return env.ASSETS.fetch(request);
  }
};
