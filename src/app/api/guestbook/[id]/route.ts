import bcrypt from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { deleteEntrySchema } from "@/lib/guestbook";
import { hashIp, isRateLimited, recordEvents } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";

// DELETE /api/guestbook/:id { password }
export async function DELETE(request: NextRequest, { params }: RouteContext<"/api/guestbook/[id]">) {
  const { id } = await params;
  const parsed = deleteEntrySchema.safeParse(await request.json().catch(() => null));
  if (!z.uuid().safeParse(id).success || !parsed.success) {
    return NextResponse.json({ error: "비밀번호를 올바르게 입력해주세요" }, { status: 400 });
  }

  // 비밀번호가 4자리 숫자(1만 가지)라 실패 횟수를 IP·글 단위로 모두 제한한다
  const failKeys = [`delete-fail:ip:${hashIp(request)}`, `delete-fail:entry:${id}`];
  const limited = await isRateLimited([
    { key: failKeys[0], limit: 5, windowSec: 10 * 60 },
    { key: failKeys[1], limit: 10, windowSec: 60 * 60 },
  ]);
  if (limited) {
    return NextResponse.json({ error: "시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요" }, { status: 429 });
  }

  const supabase = getSupabase();
  const { data: entry, error } = await supabase
    .from("guestbook_entries")
    .select("password_hash")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[guestbook] lookup failed", error);
    return NextResponse.json({ error: "삭제하지 못했습니다" }, { status: 500 });
  }
  if (!entry) {
    return NextResponse.json({ error: "이미 삭제된 메시지입니다" }, { status: 404 });
  }

  if (!(await bcrypt.compare(parsed.data.password, entry.password_hash))) {
    await recordEvents(failKeys);
    return NextResponse.json({ error: "비밀번호를 올바르게 입력해주세요" }, { status: 403 });
  }

  const { error: deleteError } = await supabase.from("guestbook_entries").delete().eq("id", id);
  if (deleteError) {
    console.error("[guestbook] delete failed", deleteError);
    return NextResponse.json({ error: "삭제하지 못했습니다" }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
