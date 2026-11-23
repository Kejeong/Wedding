import { NextResponse, type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";

// GET /api/keepalive — Vercel 크론이 하루 한 번 호출한다 (vercel.json의 crons)
// Supabase 무료 플랜은 7일 동안 요청이 없으면 프로젝트를 일시정지하므로, 가벼운 조회로 깨워 둔다
export async function GET(request: NextRequest) {
  // CRON_SECRET이 설정돼 있으면 Vercel이 "Authorization: Bearer <값>"을 붙여 호출한다
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { error } = await getSupabase().from("guestbook_entries").select("id").limit(1);
  if (error) {
    console.error("[keepalive] supabase ping failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
