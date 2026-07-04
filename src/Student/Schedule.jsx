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

export default function Schedule() {
    const navigate = useNavigate();
    const { storeID } = useParams();
    const location = useLocation();
    const { date, headcount } = location.state || {};

    const [scheduleData, setScheduleData] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

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

        setDragging(true);
        setSelectedSlots([slot.startTime]);
    };

    const handleMouseEnter = (slot) => {
        if (!dragging || !slot.available) return;

        setSelectedSlots((prev) =>
            prev.includes(slot.startTime)
                ? prev
                : [...prev, slot.startTime]
        );
    };

    const handleMouseUp = () => {
        setDragging(false);
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

                            return (
                                <div
                                    key={slot.startTime}
                                    className="schedule-row"
                                >
                                    <span className="schedule-time">
                                        {slot.startTime}
                                    </span>

                                    <button
                                        className={`schedule-slot ${!slot.available
                                            ? "closed"
                                            : "available"
                                            } ${selected ? "selected" : ""}`}
                                        disabled={!slot.available}
                                        onMouseDown={() =>
                                            handleMouseDown(slot)
                                        }
                                        onMouseEnter={() =>
                                            handleMouseEnter(slot)
                                        }
                                    >
                                        {!slot.available
                                            ? "마감"
                                            : `${slot.remainingSeats}/${scheduleData.slotCapacity}`}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </section>

            <AlertModal
                message={alertMessage}
                onClose={() => setAlertMessage("")}
            />
        </main>
    );
}