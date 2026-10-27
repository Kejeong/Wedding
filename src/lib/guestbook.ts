import { z } from "zod";

// 클라이언트(폼 검증)와 서버(API 검증)가 같은 규칙을 쓴다

export const passwordSchema = z.string().regex(/^\d{4}$/);

export const createEntrySchema = z.object({
  name: z.string().trim().min(1).max(20),
  message: z.string().trim().min(1).max(500),
  password: passwordSchema,
});

export const deleteEntrySchema = z.object({
  password: passwordSchema,
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export type GuestbookPage = {
  entries: GuestbookEntry[];
  total: number;
};
