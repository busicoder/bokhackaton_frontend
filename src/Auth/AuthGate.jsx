import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthGate.css";
import AlertModal from "../Page/Alert";

const api_url = import.meta.VITE_API_URL;

export default function AuthGate() {
    const navigate = useNavigate();

    //alert 창
    const [alertMessage, setAlertMessage] = useState("");
    const closeAlert = () => {
        setAlertMessage("");
    };

    const [form, setForm] = useState({
        userId: "",
        password: "",
    });//입력 값 설정

    const [loading, setLoading] = useState(false);//로딩 여부

    useEffect(() => {//로그인 여부 확인
        const token = localStorage.getItem("accessToken");

        if (token) {
            navigate("/reserve", { replace: true });
        }
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!form.userId.trim() || !form.password) {
            setAlertMessage("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);

            // 명세 보고 변경하기 ***************************************************************************************
            const response = await fetch(`${api_url}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: form.userId,
                    password: form.password,
                }),
            });

            if (!response.ok) {
                throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
            }

            const data = await response.json();

            localStorage.setItem("accessToken", data.accessToken);
            navigate("/reserve", { replace: true });
        } catch (error) {
            setAlertMessage(error.message || "로그인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <main className="auth-page">
                <form className="auth-card" onSubmit={handleLogin}>
                    <header className="auth-header">
                        <div className="auth-logo">
                            <FootprintIcon className="auth-logo-icon" />
                        </div>
                        <h1 className="auth-title">한걸음</h1>
                    </header>

                    <section className="auth-fields">
                        <label className="auth-field">
                            <span className="auth-field-label">아이디</span>
                            <input
                                className="auth-field-input"
                                type="text"
                                name="userId"
                                value={form.userId}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                        </label>

                        <label className="auth-field">
                            <span className="auth-field-label">비밀번호</span>
                            <input
                                className="auth-field-input"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                        </label>
                    </section>

                    <button
                        className="auth-login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>

                    <nav className="auth-links">
                        <button className="auth-link-button" type="button">
                            아이디 찾기
                        </button>

                        <span className="auth-link-divider">|</span>

                        <button className="auth-link-button" type="button">
                            비밀번호 찾기
                        </button>

                        <button
                            className="auth-link-button"
                            type="button"
                            onClick={() => navigate("/signup")}
                        >
                            회원가입
                        </button>
                    </nav>

                    <section className="auth-social">
                        <div className="auth-social-heading">
                            <span className="auth-social-line" />
                            <p className="auth-social-title">SNS 계정으로 시작</p>
                            <span className="auth-social-line" />
                        </div>

                        <div className="auth-social-buttons">
                            <button
                                className="auth-social-button auth-social-button--google"
                                type="button"
                            >
                                구글
                            </button>
                        </div>
                    </section>
                </form>
            </main>
            {alertMessage && (
                <AlertModal
                    message={alertMessage}
                    onClose={closeAlert}
                />
            )}
        </>
    );
}

function FootprintIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 30 30" aria-hidden="true">
            <g
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 3.5c2.1.2 3.2 2.1 2.7 4.7l-.9 5.2c-.4 2.2-1.7 3.4-3.4 3.2-1.8-.2-2.7-1.8-2.3-4l.9-5.2c.4-2.5 1.3-4.1 3-3.9Z" />
                <path d="M20.2 11c2.1-.3 3.4 1.2 3.7 3.8l.6 5.2c.3 2.2-.6 3.8-2.3 4-1.8.2-3-1.1-3.3-3.3l-.7-5.2c-.3-2.4.3-4.2 2-4.5Z" />
                <circle cx="8.3" cy="21.4" r="2.1" />
                <circle cx="22.5" cy="27" r="1.7" />
            </g>
        </svg>
    );
}