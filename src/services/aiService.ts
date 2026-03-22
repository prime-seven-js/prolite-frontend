import api from "@/lib/axios";

/**
 * AI Service — gọi API rewrite nội dung bằng AI.
 * Dùng trong NewFeedsPage để tự động cải thiện nội dung post trước khi đăng.
 */
export const aiService = {
  /** Gửi content gốc → nhận content đã được AI rewrite */
  rewriteWithAI: async (content: string) => {
    const res = await api.post("/rewrite", { content });
    return res.data;
  },
};