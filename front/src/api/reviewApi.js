import client from "./client";

// ✅ 리뷰 작성(등록)
export async function createReview(payload) {
  // payload 예:
  // { orderId, orderItemId, rating, content }
  const res = await client.post("/api/reviews", payload);
  return res.data;
}
