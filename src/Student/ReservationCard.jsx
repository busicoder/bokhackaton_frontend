import { useState } from "react";
import ConfirmModal from "../Page/ConfirmMordal";
import { cancelReservation } from "../Util/CancelReservation";
import AlertModal from "../Page/Alert";
export default function ReservationCard({ reservation }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const handleCancelReservation = async () => {
        try {
            await cancelReservation(
                reservation.reservationId
            );

            onCanceled?.(reservation.reservationId);

            // setAlertTitle("예약 취소 완료");
            setAlertMessage("예약이 취소되었습니다.");
        } catch (error) {
            // setAlertTitle("예약 취소 실패");
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
                        className={`reservation-status ${reservation.status.toLowerCase()
                            }`}
                    >
                        {reservation.status === "CONFIRMED"
                            ? "확정됨"
                            : "요청됨"}
                    </div>
                </div>

                <div className="reservation-info">
                    <span>🕒 {reservation.time}</span>
                    <span>👤 {reservation.headcount}명</span>
                </div>

                {reservation.status === "REQUESTED" && (
                    <button
                        className="reservation-cancel"
                        onClick={() => setShowConfirm(true)}
                    >
                        취소
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
                message={alertMessage}
                onClose={() => {
                    setAlertMessage("");
                }}
            /> 
        </>
    );
}