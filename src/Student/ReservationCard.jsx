import { useState } from "react";
import ConfirmModal from "../Page/ConfirmMordal";
import AlertModal from "../Page/Alert";
import { cancelReservation } from "../Util/CancelReservation";

export default function ReservationCard({ reservation }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");

    const handleCancelReservation = async () => {
        try {
            await cancelReservation(
                reservation.reservationId
            );

            setAlertTitle("예약 취소 완료");
            setAlertMessage("예약이 취소되었습니다.");
        } catch (error) {
            setAlertTitle("예약 취소 실패");
            setAlertMessage(error.message);
        }
    };

    return (
        <>
            <div className="reservation-card">
                <div className="reservation-top">
                    <div className="reservation-store">
                        <div className="reservation-icon">🍺</div>

                        <div>
                            <strong>{reservation.storeName}</strong>
                            <span>{reservation.date}</span>
                        </div>
                    </div>

                    <div
                        className={`reservation-status ${reservation.status.toLowerCase()}`}
                    >
                        {reservation.status === "CONFIRMED"
                            ? "확정됨"
                            : reservation.status === "REQUESTED"
                              ? "요청됨"
                              : "취소됨"}
                    </div>
                </div>

                <div className="reservation-info">
                    <span>
                        🕒 {reservation.startTime} ~ {reservation.endTime}
                    </span>
                    <span>👤 {reservation.headcount}명</span>
                </div>

                {/* 요청 상태일 때만 취소 버튼 */}
                {reservation.status === "REQUESTED" && (
                    <button
                        className="reservation-cancel"
                        onClick={() => setShowConfirm(true)}
                    >
                        취소하기
                    </button>
                )}
            </div>

            {showConfirm && (
                <ConfirmModal
                    title="예약을 취소하시겠어요?"
                    message="취소된 예약은 복구할 수 없습니다."
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={async () => {
                        await handleCancelReservation();
                        setShowConfirm(false);
                    }}
                />
            )}

            <AlertModal
                title={alertTitle}
                message={alertMessage}
                onClose={() => {
                    setAlertTitle("");
                    setAlertMessage("");
                }}
            />
        </>
    );
}