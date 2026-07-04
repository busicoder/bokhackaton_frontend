import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../Page/Alert";
import "./SignUp.css";

export default function SignUp() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userId: "",
        password: "",
        userType: "",
        phoneNumber: "",
    });

    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkID, setCheckID] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const selectUserType = (userType) => {
        setForm((current) => ({
            ...current,
            userType,
        }));
    };

    const CheckingID = async () => { //명세 나온 이후 수정 필요 ************************************************************
        const userId = form.userId.trim();

        if (!userId) {
            setCheckID(false);
            setAlertMessage("아이디를 입력해주세요.");
            return false;
        }

        try {
            const response = await fetch(
                `/api/users/check-id?userId=${encodeURIComponent(userId)}`
            );//api 파트 수정 필요 **************************************************************************

            if (!response.ok) {
                throw new Error("아이디 중복 확인에 실패했습니다.");
            }

            const data = await response.json();

            // 서버 응답 예시: { duplicated: true }
            if (data.duplicated) {
                setCheckID(false);
                setAlertMessage("이미 사용 중인 아이디입니다.");
                return false;
            }

            setCheckID(true);
            setAlertMessage("사용 가능한 아이디입니다.");
            return true;
        } catch (error) {
            setCheckID(false);
            setAlertMessage(error.message);
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.userId.trim()) {
            setAlertMessage("아이디를 입력해주세요.");
            return;
        }

        if (!form.password) {
            setAlertMessage("비밀번호를 입력해주세요.");
            return;
        }

        if (!form.userType) {
            setAlertMessage("유저 유형을 선택해주세요.");
            return;
        }

        if (!form.phoneNumber) {
            setAlertMessage("전화번호를 입력해주세요.");
            return;
        }

        if (!checkID) {
            const res = await CheckingID();
        }

        try {
            setLoading(true);

            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error("회원가입에 실패했습니다.");
            }

            setAlertMessage("회원가입이 완료되었습니다.");
        } catch (error) {
            setAlertMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const closeAlert = () => {
        const completed = alertMessage === "회원가입이 완료되었습니다.";

        setAlertMessage("");

        if (completed) {
            navigate("/", { replace: true });
        }
    };

    return (
        <main className="signup-page">
            <form className="signup-container" onSubmit={handleSubmit}>
                <header className="signup-header">
                    <button
                        className="signup-back-button"
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="뒤로 가기"
                    >
                        ‹
                    </button>

                    <p className="signup-header-title">프로필 만들기</p>
                </header>

                <section className="signup-content">
                    <h1 className="signup-title">회원 가입</h1>

                    <div className="signup-fields">
                        <div className="signup-field">
                            <div className="signup-label-row">
                                <label className="signup-label" htmlFor="signup-user-id">
                                    아이디
                                </label>
                                <span className="signup-required">필수</span>
                            </div>

                            <div className="signup-id-row">
                                <input
                                    className="signup-input signup-id-input"
                                    id="signup-user-id"
                                    type="text"
                                    name="userId"
                                    value={form.userId}
                                    onChange={() => { setCheckID(false); handleChange(); }}
                                    placeholder="영문. 10자 이내."
                                    autoComplete="username"
                                />

                                <button
                                    className="signup-generate-button"
                                    type="button"
                                    disabled={checkID}
                                    onClick={CheckingID}
                                >
                                    중복 확인
                                </button>
                            </div>
                        </div>

                        <div className="signup-field">
                            <div className="signup-label-row">
                                <label className="signup-label" htmlFor="signup-password">
                                    비밀번호
                                </label>
                                <span className="signup-required">필수</span>
                            </div>

                            <input
                                className="signup-input"
                                id="signup-password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력해주세요"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="signup-field">
                            <div className="signup-label-row">
                                <span className="signup-label">유저 유형</span>
                                <span className="signup-required">필수</span>
                            </div>

                            <div className="signup-type-buttons">
                                <button
                                    className={`signup-type-button ${form.userType === "STUDENT"
                                        ? "signup-type-button--selected"
                                        : ""
                                        }`}
                                    type="button"
                                    onClick={() => selectUserType("STUDENT")}
                                >
                                    학생
                                </button>

                                <button
                                    className={`signup-type-button ${form.userType === "OWNER"
                                        ? "signup-type-button--selected"
                                        : ""
                                        }`}
                                    type="button"
                                    onClick={() => selectUserType("OWNER")}
                                >
                                    사장
                                </button>
                            </div>
                        </div>

                        <div className="signup-field">
                            <label className="signup-label" htmlFor="signup-phone">
                                전화 번호
                            </label>

                            <input
                                className="signup-input signup-phone-input"
                                id="signup-phone"
                                type="tel"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="010-0000-0000"
                                autoComplete="tel"
                            />
                        </div>
                    </div>
                </section>

                <footer className="signup-footer">
                    <button
                        className="signup-submit-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "처리 중..." : "완료"}
                    </button>
                </footer>
            </form>

            <AlertModal message={alertMessage} onClose={closeAlert} />
        </main>
    );
}