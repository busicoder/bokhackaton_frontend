const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function fetchMyReservations() {
  // if (import.meta.env.VITE_MOCK_DATA) {
  //   return mockReservationResponse.data;
  // }

  const response = await fetch(
    `${API_URL}/api/reservations/me`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "예약 목록 조회 실패"
    );
  }

  return result.data;
}

const mockReservationResponse = {
  success: true,
  code: 200,
  message: "예약 목록 조회 성공",
  data: {
    totalReservations: 2,
    reservations: [
      {
        reservationId: 10,
        storeName: "낭만오지",
        date: "2026-07-12",
        startTime: "18:00",
        endTime: "19:00",
        headcount: 4,
        status: "CONFIRMED",
      },
      {
        reservationId: 11,
        storeName: "캠퍼스 맥주창고",
        date: "2026-07-13",
        startTime: "20:00",
        endTime: "21:00",
        headcount: 3,
        status: "REQUESTED",
      },
    ],
  },
};