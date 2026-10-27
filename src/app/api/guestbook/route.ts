import bcrypt from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { createEntrySchema, type GuestbookEntry, type GuestbookPage } from "@/lib/guestbook";
import { hashIp, isRateLimited, recordEvents } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";

const MAX_LIMIT = 100;

// GET /api/guestbook?limit=3&offset=0
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const limit = Math.min(Math.max(Number(params.get("limit")) || 20, 1), MAX_LIMIT);
  const offset = Math.max(Number(params.get("offset")) || 0, 0);

  const { data, count, error } = await getSupabase()
    .from("guestbook_entries")
    .select("id, name, message, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[guestbook] list failed", error);
    return NextResponse.json({ error: "방명록을 불러오지 못했습니다" }, { status: 500 });
  }

  const body: GuestbookPage = {
    entries: data.map(
      (row): GuestbookEntry => ({ id: row.id, name: row.name, message: row.message, createdAt: row.created_at }),
    ),
    total: count ?? 0,
  };
  return NextResponse.json(body);
}

// POST /api/guestbook { name, message, password }
export async function POST(request: NextRequest) {
  const parsed = createEntrySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "정보를 올바르게 입력해주세요" }, { status: 400 });
  }

  const ipHash = hashIp(request);
  const postKey = `post:ip:${ipHash}`;
  if (await isRateLimited([{ key: postKey, limit: 5, windowSec: 10 * 60 }])) {
    return NextResponse.json({ error: "잠시 후 다시 시도해주세요" }, { status: 429 });
  }

  const { name, message, password } = parsed.data;
  const { data, error } = await getSupabase()
    .from("guestbook_entries")
    .insert({ name, message, password_hash: await bcrypt.hash(password, 10), ip_hash: ipHash })
    .select("id, name, message, created_at")
    .single();

  if (error) {
    console.error("[guestbook] insert failed", error);
    return NextResponse.json({ error: "메시지를 저장하지 못했습니다" }, { status: 500 });
  }
  await recordEvents([postKey]);

  const entry: GuestbookEntry = { id: data.id, name: data.name, message: data.message, createdAt: data.created_at };
  return NextResponse.json(entry, { status: 201 });
}
