import client from "./client";

// ✅ 지금은 임시 더미(나중에 API 붙이면 이 부분 삭제/교체)
const MOCK_ME = {
  userId: "dami123",
  name: "이다미",
  phone: "01012345678",
  email: "dami@test.com",
  address: "경기도 수원시 ...",
  addressDetail: "101동 1004호",
};

// ✅ 모드 스위치: 지금은 mock, 나중에 false로 바꾸면 API로 감
const USE_MOCK = true;

// ✅ "내 정보 가져오기"
export async function getMyProfile() {
  if (USE_MOCK) {
    // 실제처럼 동작하게 Promise로 감싸기
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_ME), 300));
  }

  // ✅ 나중에 백엔드 붙이면 이 부분만 살리면 됨
  const res = await client.get("/api/me");
  return res.data;

  throw new Error("API 연결 필요");
}

// ✅ "내 정보 수정하기"
export async function updateMyProfile(payload) {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ok: true }), 300)
    );
  }

  // ✅ 나중에 백엔드 붙이면 이 부분만 살리면 됨
  const res = await client.put("/api/me", payload);
  return res.data;

  throw new Error("API 연결 필요");
}

// ✅ "비밀번호 변경" (보통 프로필 수정 API랑 분리하는 게 안전)
export async function changePassword(payload) {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ok: true }), 300)
    );
  }

  // ✅ 나중에 백엔드 붙이면 이 부분만 살리면 됨
  const res = await client.post("/api/me/password", payload);
  return res.data;

  throw new Error("API 연결 필요");
}
