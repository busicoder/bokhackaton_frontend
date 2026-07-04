const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export async function LogOut(){
  const response = await fetch(
    `${API_URL}/api/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "로그아웃 실패"
    );
  }

  return result.data;
}