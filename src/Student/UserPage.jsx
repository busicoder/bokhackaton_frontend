import { useEffect, useState } from "react";
import "./UserPage.css";
import ReservationCard from "./ReservationCard";
import AlertModal from "../Page/Alert";
import { fetchMyReservations } from "../Util/GetMyReservation";
import { useNavigate } from "react-router-dom";
import { LogOut } from "../Util/LogOut";


export default function MyPage() {
    const [reservations, setReservations] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
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
    useEffect(() => {
        const loadReservations = async () => {
            try {
                const data = await fetchMyReservations();

                setReservations(data.reservations);
            } catch (error) {
                setAlertMessage(
                    error.message || "예약 목록을 불러오지 못했습니다."
                );
            }
        };

        loadReservations();
    }, []);

    const total = reservations.length;

    const confirmed = reservations.filter(
        (reservation) => reservation.status === "CONFIRMED"
    ).length;

    const requested = reservations.filter(
        (reservation) => reservation.status === "REQUESTED"
    ).length;

    return (
        <main className="mypage">
            <section className="mypage-profile">
                <div className="mypage-user">
                    <div className="mypage-user-left">
                        <div className="mypage-avatar">👤</div>

                        <div>
                            <strong>{userId}님</strong>
                        </div>
                    </div>

                    <button
                        className="mypage-logout-button"
                        onClick={async () => {
                            try {
                                await LogOut();

                                localStorage.removeItem("user");

                                navigate("/", { replace: true });
                            } catch (error) {
                                setAlertMessage(
                                    error.message || "로그아웃에 실패했습니다."
                                );
                            }
                        }}
                    >
                        로그아웃
                    </button>
                </div>

                <div className="mypage-stats">
                    <div>
                        <strong>{total}</strong>
                        <span>전체 예약</span>
                    </div>

                    <div>
                        <strong>{confirmed}</strong>
                        <span>확정됨</span>
                    </div>

                    <div>
                        <strong>{requested}</strong>
                        <span>요청 중</span>
                    </div>
                </div>
            </section>

            <section className="mypage-history">
                <h2>예약 현황</h2>

                {reservations.length === 0 ? (
                    <p className="mypage-empty">
                        예약 내역이 없습니다.
                    </p>
                ) : (
                    reservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.reservationId}
                            reservation={reservation}
                        />
                    ))
                )}
            </section>

            <AlertModal
                message={alertMessage}
                onClose={() => setAlertMessage("")}
            />
        </main>
    );
}