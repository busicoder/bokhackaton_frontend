import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import { ChevronLeft, CalendarDays, User } from "lucide-react";
import { fetchTimeSlots } from "../Util/GetStores";
import AlertModal from "../Page/Alert";
import "./Schedule.css";
import { useRef } from "react";
import { createReservation } from "../Util/PostResevation";

export default function Schedule() {
    const navigate = useNavigate();
    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const userId = user?.loginId;
    useEffect(() => {
        if (!userId) {
            navigate("/", { replace: true });
        }
    }, [userId, navigate]);
    const { storeID } = useParams();
    const location = useLocation();
    const { date, headcount } = location.state || {};

    const [scheduleData, setScheduleData] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [dragMode, setDragMode] = useState(null); // "add" | "remove"
    const [alertMessage, setAlertMessage] = useState("");
    const [title, setTitle] = useState("");
    const handleReservation = async () => {
        if (selectedSlots.length === 0) {
            setAlertMessage("시간대를 선택해주세요.");
            return;
        }

        try {
            const sortedSlots = [...selectedSlots].sort();

            const startTime = sortedSlots[0];
            const endTime = (() => {
                const [hour, minute] =
                    sortedSlots[sortedSlots.length - 1]
                        .split(":")
                        .map(Number);

                const nextHour = hour + 1;

                return `${String(nextHour).padStart(2, "0")}:${String(
                    minute
                ).padStart(2, "0")}`;
            })();

            const result = await createReservation({
                storeId: Number(storeID),
                date,
                startTime,
                endTime,
                headcount,
            });
            setTitle("예약요청이 전달되었어요!")
            setAlertMessage(
                "가게 사정에 의해 취소될 수 있어요.\n취소될 경우 전화로 연락드립니다!"
            );
        } catch (error) {
            setAlertMessage(error.message);
        }
    };

    useEffect(() => {
        if (!date || !headcount) {
            navigate(-1);
            return;
        }

        const loadSchedule = async () => {
            try {
                const data = await fetchTimeSlots(
                    storeID,
                    date,
                    headcount
                );

                setScheduleData(data);
            } catch (error) {
                setAlertMessage(error.message);
            }
        };

        loadSchedule();
    }, [storeID, date, headcount, navigate]);

    const handleMouseDown = (slot) => {
        if (!slot.available) return;

        const alreadySelected = selectedSlots.includes(slot.startTime);

        setDragging(true);

        if (alreadySelected) {
            setDragMode("remove");
            setSelectedSlots((prev) =>
                prev.filter((time) => time !== slot.startTime)
            );
        } else {
            setDragMode("add");

            setSelectedSlots((prev) => {
                if (prev.length === 0) {
                    return [slot.startTime];
                }

                const sorted = sortTimes(prev);

                const firstSelected = sorted[0];
                const lastSelected = sorted[sorted.length - 1];

                if (
                    isAdjacent(firstSelected, slot.startTime) ||
                    isAdjacent(lastSelected, slot.startTime)
                ) {
                    return sortTimes([...prev, slot.startTime]);
                }

                // 끊기면 새 구간 시작
                return [slot.startTime];
            });
        }
    };
    const sortTimes = (times) => {
        return [...times].sort((a, b) => {
            const [hourA, minA] = a.split(":").map(Number);
            const [hourB, minB] = b.split(":").map(Number);

            return (hourA * 60 + minA) - (hourB * 60 + minB);
        });
    };
    const isAdjacent = (timeA, timeB) => {
        const [hourA, minA] = timeA.split(":").map(Number);
        const [hourB, minB] = timeB.split(":").map(Number);

        const totalA = hourA * 60 + minA;
        const totalB = hourB * 60 + minB;

        return Math.abs(totalA - totalB) === 60;
    };

    const handleMouseEnter = (slot) => {
        if (!dragging || !slot.available) return;

        setSelectedSlots((prev) => {
            if (dragMode === "add") {
                if (prev.includes(slot.startTime)) return prev;

                const sorted = sortTimes(prev);

                const firstSelected = sorted[0];
                const lastSelected = sorted[sorted.length - 1];

                if (
                    prev.length === 0 ||
                    isAdjacent(firstSelected, slot.startTime) ||
                    isAdjacent(lastSelected, slot.startTime)
                ) {
                    return sortTimes([...prev, slot.startTime]);
                }

                // 중간 끊기면 리셋
                return [slot.startTime];
            }

            if (dragMode === "remove") {
                const filtered = prev.filter(
                    (time) => time !== slot.startTime
                );

                // 제거 후 남은 슬롯도 연속 유지
                if (filtered.length <= 1) return filtered;

                const sorted = [...filtered].sort();

                let valid = true;

                for (let i = 1; i < sorted.length; i++) {
                    if (!isAdjacent(sorted[i - 1], sorted[i])) {
                        valid = false;
                        break;
                    }
                }

                // 끊기면 최근 것만 유지
                if (!valid) {
                    return [slot.startTime];
                }

                return filtered;
            }

            return prev;
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
        setDragMode(null);
    };

    if (!scheduleData) return null;

    return (
        <main
            className="schedule-page"
            onMouseUp={handleMouseUp}
        >
            <section className="schedule-container">
                <header className="schedule-header">
                    <button
                        className="schedule-back"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <h1>{scheduleData.storeName}</h1>
                </header>

                <section className="schedule-info">
                    <div>
                        <CalendarDays size={16} />
                        <span>{scheduleData.date}</span>
                    </div>

                    <div>
                        <User size={16} />
                        <span>{headcount}명</span>
                    </div>
                </section>

                <section className="schedule-content">
                    <h2>시간대를 선택하세요</h2>
                    <p>드래그하여 원하는 시간대를 선택하세요</p>

                    <div className="schedule-slot-list">
                        {scheduleData.slots.map((slot) => {
                            const selected =
                                selectedSlots.includes(slot.startTime);

                            const canReserve = slot.remainingSeats >= Number(headcount);

                            const isFullAvailable = canReserve && slot.remainingSeats === scheduleData.slotCapacity;

                            const isPartial = canReserve && slot.remainingSeats < scheduleData.slotCapacity;

                            return (
                                <div
                                    key={slot.startTime}
                                    className="schedule-row"
                                >
                                    <span className="schedule-time">
                                        {slot.startTime}
                                    </span>

                                    <button
                                        className={`schedule-slot
                                        ${!canReserve ? "closed" : ""}
                                        ${isPartial ? "partial" : ""}
                                        ${selected ? "selected" : ""}
                                        `}
                                        disabled={!canReserve}
                                        onMouseDown={() =>
                                            handleMouseDown(slot)
                                        }
                                        onMouseEnter={() =>
                                            handleMouseEnter(slot)
                                        }
                                    >
                                        {!slot.available && "마감"}

                                        {isPartial &&
                                            `${slot.remainingSeats}/${scheduleData.slotCapacity}`}

                                        {selected && isFullAvailable && "✓"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="schedule-legend">
                        <div className="schedule-legend-item">
                            <div className="schedule-legend-box closed" />
                            <span>마감</span>
                        </div>

                        <div className="schedule-legend-item">
                            <div className="schedule-legend-box partial">
                                1/2
                            </div>
                            <span>일부 가능</span>
                        </div>

                        <div className="schedule-legend-item">
                            <div className="schedule-legend-box selected" />
                            <span>선택됨</span>
                        </div>
                    </div>

                </section>
                {selectedSlots.length > 0 && (
                    <div className="schedule-action-bar">
                        <div className="schedule-action-info">
                            <span>선택 시간</span>
                            <strong>
                                {selectedSlots[0]}~
                                {selectedSlots[selectedSlots.length - 1]}
                            </strong>
                        </div>

                        <button className="schedule-action-button"
                            onClick={handleReservation}
                        >
                            예약 요청
                        </button>
                    </div>
                )}
            </section>

            <AlertModal
                message={alertMessage}
                title={title}
                onClose={() => {
                    const isSuccess = title === "예약요청이 전달되었어요!";

                    setAlertMessage("");
                    setTitle("");

                    if (isSuccess) {
                        navigate("/mypage");
                    }
                }}
            />
        </main>
    );
}