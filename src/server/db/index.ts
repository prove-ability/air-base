import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

import { env } from "@/env";
import * as schema from "./schema";

// neonConfig.webSocketConstructor = ws;
if (!process.env.VERCEL) {
  // Vercel 환경이 아닌 경우에만 웹소켓 설정
  neonConfig.webSocketConstructor = ws;
}

/**
 * 개발 환경에서 HMR 업데이트마다 새로운 연결이 생성되는 것을 방지하기 위해
 * 데이터베이스 연결을 캐시합니다.
 */
const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof neon> | undefined;
};

export let db: ReturnType<typeof drizzle<typeof schema>>;

if (typeof window === "undefined") {
  // 서버 사이드 코드
  const conn = globalForDb.conn ?? neon(env.DATABASE_URL);

  if (env.NODE_ENV !== "production") {
    globalForDb.conn = conn;
  }

  db = drizzle(conn, { schema });
} else {
  // 클라이언트 사이드에서는 실행하지 않음
}
// export const db = drizzle(pool, { schema });
