const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function createReservation({
  storeId,
  date,
  startTime,
  endTime,
  headcount,
}) {
  const response = await fetch(
    `${API_URL}/api/reservations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        storeId,
        date,
        startTime,
        endTime,
        headcount,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "예약 신청 실패"
    );
  }

  return result.data;
}