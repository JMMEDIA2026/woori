import { Client } from "pg";

export interface Env {
  HYPERDRIVE: any; // Hyperdrive binding
}

/**
 * Cloudflare Workers 환경에서 Hyperdrive를 활용하여 SQL 쿼리를 수행하는 유틸리티
 */
export async function queryHyperdrive(env: Env, queryText: string, params: any[] = []) {
  // 매 요청마다 새로운 클라이언트 인스턴스를 생성
  // Hyperdrive가 커넥션 풀링을 유지하므로 빠릅니다.
  const client = new Client({
    connectionString: env.HYPERDRIVE.connectionString,
  });

  try {
    await client.connect();
    const result = await client.query(queryText, params);
    return result.rows;
  } catch (error) {
    console.error("Hyperdrive Query Error:", error);
    throw error;
  } finally {
    // 연결 종료
    await client.end();
  }
}
