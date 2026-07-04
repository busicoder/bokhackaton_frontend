const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function cancelReservation(
  reservationId
) {
  const response = await fetch(
    `${API_URL}/api/reservations/${reservationId}/cancel`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "예약 취소 실패"
    );
  }

  return result.data;
}