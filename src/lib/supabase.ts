import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

/** RLS를 우회하는 서버 전용 클라이언트. 클라이언트 컴포넌트에서 import 하면 빌드 에러가 난다. */
export function getSupabase() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SECRET_KEY 환경변수가 필요합니다");
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
