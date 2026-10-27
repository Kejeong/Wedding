import "server-only";
import { createHash } from "node:crypto";
import { getSupabase } from "@/lib/supabase";

/** 개인정보를 남기지 않도록 IP는 salt를 섞어 해시로만 저장 */
export function hashIp(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return createHash("sha256")
    .update(`${process.env.IP_HASH_SALT ?? ""}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

type Rule = { key: string; limit: number; windowSec: number };

/** 하나라도 한도를 넘었으면 true */
export async function isRateLimited(rules: Rule[]) {
  const supabase = getSupabase();
  const counts = await Promise.all(
    rules.map(async ({ key, windowSec }) => {
      const since = new Date(Date.now() - windowSec * 1000).toISOString();
      const { count, error } = await supabase
        .from("rate_limit_events")
        .select("id", { count: "exact", head: true })
        .eq("key", key)
        .gte("created_at", since);
      if (error) throw error;
      return count ?? 0;
    }),
  );
  return rules.some((rule, i) => counts[i] >= rule.limit);
}

export async function recordEvents(keys: string[]) {
  const { error } = await getSupabase()
    .from("rate_limit_events")
    .insert(keys.map((key) => ({ key })));
  if (error) throw error;
}
