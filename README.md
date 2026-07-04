# 🍺 ZZan

> 대학가 술집 예약을 위한 **세션 기반 실시간 예약 플랫폼**

| **Frontend** | **Backend** | **기획&디자인** |
| :---: | :---: | :---: |
| [@busicoder](https://github.com/busicoder) | [@yxzkng](https://github.com/yxzkng), [@minjaejyo](https://github.com/minjaejyo) | 정우정 |
| [zzan-frontend](https://github.com/busicoder/bokhackaton_frontend) | [zzan-backend](https://github.com/yxzkng/zzan) | |
<br>

---

# 1. 프로젝트 목적

대학가 술집 예약은 대부분 전화나 메시지 기반으로 이루어집니다.

이 방식은 다음 문제를 가집니다:

- 현재 예약 가능 여부 확인이 어려움
- 시간대별 잔여석 파악 불가
- 예약 변경/취소 흐름 비효율적

ZZan은 이를 해결하기 위해:

- 시간 슬롯 기반 예약 시스템
- 실시간 잔여석 반영
- 세션 기반 사용자 인증
- 예약 요청/취소 관리

를 제공합니다.

---

# 2. System Architecture

```text
Client (React + Vite)
        │
        │ HTTPS
        ▼
Vercel (SPA + API Rewrite)
        │
        │ HTTP
        ▼
Spring Boot API Server
        │
        ├── Authentication (Session)
        ├── Reservation Logic
        ├── Store Availability Engine
        └── Database
```

---

# 3. Tech Stack

## Frontend

| Tech | Description |
|---|---|
| React | UI Rendering |
| Vite | Build Tool |
| React Router | SPA Routing |
| React DatePicker | Date Selection |
| Lucide React | Icons |
| CSS Variables | Design System |

---

## Backend

| Tech | Description |
|---|---|
| Spring Boot | API Server |
| Spring Security | Session Auth |
| JPA | ORM |
| MySQL | Database |

---

## Deploy

| Layer | Service |
|---|---|
| Frontend | Vercel |
| Backend | DuckDNS + VPS |

---

# 4. Frontend Architecture

## Directory Structure

```bash
src/
├── assets/
│   ├── zzanicon.png
│   └── BeerIcon.png
│
├── Auth/
│   ├── AuthGate.jsx
│   └── Signup.jsx
│
├── Reserve/
│   ├── StoreList.jsx
│   ├── Schedule.jsx
│   └── StoreList.css
│
├── User/
│   ├── UserPage.jsx
│   ├── ReservationCard.jsx
│   └── UserPage.css
│
├── Page/
│   ├── Alert.jsx
│   └── ConfirmModal.jsx
│
├── Util/
│   ├── GetStores.js
│   ├── GetTimeSlots.js
│   ├── PostReservation.js
│   ├── GetMyReservation.js
│   ├── CancelReservation.js
│   ├── LogOut.js
│   └── formatDate.js
│
├── App.jsx
└── main.jsx
```

---

# 5. Routing Design

```text
/                 → Login Page
/signup           → Signup Page
/reserve          → Store List
/reserve/:storeID → Time Slot Select
/mypage           → My Reservation List
```

## BE Https 미지원 이슈
SPA refresh issue solved with:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://backend/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

# 6. Authentication Strategy

세션 기반 인증 사용.

로그인 성공 시:

```javascript
localStorage.setItem(
  "user",
  JSON.stringify(result.data)
);
```

저장 데이터:

```json
{
  "id": 1,
  "loginId": "student01",
  "role": "STUDENT"
}
```

Route Guard:

```javascript
useEffect(() => {
  if (!user) navigate("/");
}, []);
```

---

# 7. API Layer Pattern

모든 API는 Util Layer로 분리.

예:

```javascript
export async function fetchStores(date, headcount) {
  const response = await fetch(
    `/api/stores?date=${date}&headcount=${headcount}`,
    {
      credentials: "include"
    }
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}
```

패턴:

```text
Component
→ Util API Function
→ Fetch
→ Response Validation
→ Return Data
```

장점:

- UI와 API 로직 분리
- 테스트 용이
- 유지보수 쉬움

---

# 8. Reservation Slot Selection Logic

핵심 구현.

시간대 선택 방식:

```text
mousedown → drag start
mouseenter → add/remove
mouseup → drag end
```

제약:

---

## 1. 연속 선택만 허용

```text
17:00 → 18:00 → 19:00
가능

17:00 → 18:00 /              / 19:00 → 20:00
불가
```

검사:

```javascript
Math.abs(totalA - totalB) === 60
```

---

## 2. 중간 끊기면 reset

```text
17 → 18 → 21
→ reset to 21
```

---

## 3. 누적형 드래그 해제 지원

이미 선택된 슬롯에서 시작:

```text
dragMode = remove
```

---

# 9. Slot Rendering State Machine

각 슬롯 상태:

```text
available
partial
closed
selected
```

우선순위:

```text
selected > closed > partial > available
```

렌더링:

```javascript
className={`
  schedule-slot
  ${!slot.available ? "closed" : ""}
  ${isPartial ? "partial" : ""}
  ${selected ? "selected" : ""}
`}
```

---

# 10. Reservation Range Conversion

선택 슬롯:

```text
18:00
19:00
20:00
```

전송:

```text
startTime = 18:00
endTime = 21:00
```

endTime 계산:

```javascript
const addOneHour = (time) => {
  const [hour, minute] = time.split(":").map(Number);

  return `${String(hour + 1).padStart(2, "0")}:${minute}`;
};
```

---

# 11. UI System

Design Token 기반.

```css
:root {
  --color-primary
  --space-1 ~ --space-8
  --radius-small ~ round
  --font-size-small ~ title
}
```

장점:

- 일관성 유지
- 하드코딩 제거
- 유지보수 용이

---

# 12. Deployment Strategy

Development:

```text
Vite Dev Server
↓
Proxy
↓
Spring Boot Local
```

Production:

```text
Vercel
↓
Rewrite /api/*
↓
DuckDNS Server
```

---

## vite.config.js

```javascript
server: {
  proxy: {
    "/api": "http://localhost:8081"
  }
}
```

---

## vercel.json

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://your-backend/api/:path*"
    }
  ]
}
```

---

# 13. Error Handling Strategy

공통 패턴:

```javascript
if (!response.ok || !result.success) {
  throw new Error(
    result.message || "요청 실패"
  );
}
```

UI:

```text
AlertModal
ConfirmModal
```

사용.

---

# 14. Future Improvements

- WebSocket 기반 실시간 잔여석 반영
- Owner Dashboard
- 예약 승인 시스템
- 예약 알림 (SMS)
- QR Check-in
- 위치 기반 술집 필터링

---

# Developer Notes

이 프로젝트는:

- 모바일 퍼스트 UI
- 상태 기반 인터랙션 설계
- API Layer 분리
- 세션 인증
- 배포 Rewrite 구조

를 중점적으로 설계했습니다.

## BE
https://github.com/yxzkng/zzan
