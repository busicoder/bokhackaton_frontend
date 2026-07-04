import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../Page/Alert";
import "./AuthGate.css";
import BeerIcon from "../assets/zzanicon.png";

const API_URL = import.meta.env.VITE_API_URL;

export default function AuthGate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        loginId: "",
        password: "",
    });

    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        if (user?.role === "STUDENT") {
            navigate("/reserve", { replace: true });
            return;
        }

        if (user?.role === "OWNER") {
            navigate("/owner", { replace: true });
        }
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };
    console.log(API_URL);
    const handleLogin = async (event) => {
        event.preventDefault();

        if (!form.loginId.trim()) {
            setAlertMessage("아이디를 입력해주세요.");
            return;
        }

        if (!form.password) {
            setAlertMessage("비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    loginId: form.loginId.trim(),
                    password: form.password,
                }),
            });

            const result = await response.json();

            if (response.status === 401) {
                setAlertMessage(
                    result.message || "아이디 또는 비밀번호가 올바르지 않습니다."
                );
                return;
            }

            if (!response.ok || !result.success) {
                throw new Error(result.message || "로그인에 실패했습니다.");
            }

            // 로그인 정보 저장
            localStorage.setItem(
                "user",
                JSON.stringify(result.data)
            );

            const role = result.data?.role;

            if (role === "STUDENT") {
                navigate("/reserve", { replace: true });
                return;
            }

            if (role === "OWNER") {
                navigate("/owner", { replace: true });
                return;
            }

            throw new Error("사용자 권한을 확인할 수 없습니다.");
        } catch (error) {
            setAlertMessage(
                error.message || "서버와 통신할 수 없습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-container">
                <div className="auth-brand">
                    <img
                        className="auth-brand-icon"
                        src={BeerIcon}
                        alt="Beer Icon"
                    />

                    <h1 className="auth-title">ZZan</h1>

                    <p className="auth-description">
                        학교 근처 술자리, 손쉽게 예약
                    </p>
                </div>

                <form className="auth-card" onSubmit={handleLogin}>
                    <div className="auth-fields">
                        <label className="auth-field">
                            <span className="auth-field-label">아이디</span>

                            <input
                                className="auth-field-input"
                                type="text"
                                name="loginId"
                                value={form.loginId}
                                onChange={handleChange}
                                placeholder="아이디를 입력하세요"
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
                                placeholder="비밀번호를 입력하세요"
                                autoComplete="current-password"
                            />
                        </label>
                    </div>

                    <button
                        className="auth-login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="auth-signup">
                    <span className="auth-signup-text">계정이 없으신가요?</span>

                    <button
                        className="auth-signup-button"
                        type="button"
                        onClick={() => navigate("/signup")}
                    >
                        회원가입
                    </button>
                </div>
            </section>

            <AlertModal
                message={alertMessage}
                onClose={() => setAlertMessage("")}
            />
        </main>
    );
}