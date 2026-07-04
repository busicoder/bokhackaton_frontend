const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function fetchStores(date, headcount) {
  // if(import.meta.env.VITE_MOCK_DATA){
  //   return mockStoreResponse.data;
  // }
  const query = new URLSearchParams({
    date,
    headcount,
  });

  const response = await fetch(
    `${API_URL}/api/stores?${query.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "술집 목록을 불러오지 못했습니다."
    );
  }

  return result.data;
}

export async function fetchTimeSlots(
  storeId,
  date,
  headcount
) {
  const query = new URLSearchParams({
    date,
    headcount,
  });
  // if(import.meta.env.VITE_MOCK_DATA){
  //   return mockTimeSlotResponse.data;
  // }

  const response = await fetch(
    `${API_URL}/api/stores/${storeId}/timeslots?${query.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "예약 현황 조회 실패"
    );
  }

  return result.data;
}

const mockStoreResponse = {
  success: true,
  code: 200,
  message: "술집 목록 조회 성공",
  data: {
    date: "2026-07-12",
    headcount: 4,
    stores: [
      {
        id: 1,
        name: "홍대포차",
        address: "정문 도보 1분",
        openTime: "17:00",
        closeTime: "24:00",
        remainingSeatsMax: 12,
      },
      {
        id: 2,
        name: "연대 양꼬치",
        address: "후문 도보 3분",
        openTime: "17:00",
        closeTime: "24:00",
        remainingSeatsMax: 8,
      },
      {
        id: 3,
        name: "신촌 이자카야",
        address: "정문 도보 5분",
        openTime: "18:00",
        closeTime: "02:00",
        remainingSeatsMax: 10,
      },
      {
        id: 4,
        name: "학림 생맥주",
        address: "남문 도보 2분",
        openTime: "16:00",
        closeTime: "01:00",
        remainingSeatsMax: 6,
      },
      {
        id: 5,
        name: "연남 주막",
        address: "후문 도보 7분",
        openTime: "18:00",
        closeTime: "03:00",
        remainingSeatsMax: 15,
      },
    ],
  },
};
export const mockTimeSlotResponse = {
  success: true,
  code: 200,
  message: "예약 현황 조회 성공",
  data: {
    storeId: 1,
    storeName: "홍대포차",
    date: "2026-07-10",
    slotCapacity: 86,
    slots: [
      {
        startTime: "17:00",
        remainingSeats: 86,
        available: true,
      },
      {
        startTime: "18:00",
        remainingSeats: 40,
        available: true,
      },
      {
        startTime: "19:00",
        remainingSeats: 0,
        available: false,
      },
      {
        startTime: "20:00",
        remainingSeats: 50,
        available: true,
      },
      {
        startTime: "21:00",
        remainingSeats: 86,
        available: true,
      },
      {
        startTime: "22:00",
        remainingSeats: 0,
        available: false,
      },
      {
        startTime: "23:00",
        remainingSeats: 86,
        available: true,
      }
    ]
  }
};