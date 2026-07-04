import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertModal from "../Page/Alert";
import "./SignUp.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: "",
    password: "",
    role: "",
    phoneNumber: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [signupCompleted, setSignupCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const selectUserType = (role) => {
    setForm((current) => ({
      ...current,
      role,
    }));
  };

  const validateForm = () => {
    if (!form.loginId.trim()) {
      return "아이디를 입력해주세요.";
    }

    if (form.loginId.trim().length < 4 || form.loginId.trim().length > 12) {
      return "아이디는 4~12자 이내로 입력해주세요.";
    }

    if (!form.password) {
      return "비밀번호를 입력해주세요.";
    }

    if (form.password.length < 8) {
      return "비밀번호는 8자 이상 입력해주세요.";
    }

    if (!form.role) {
      return "유저 유형을 선택해주세요.";
    }

    if (!form.phoneNumber.trim()) {
      return "전화번호를 입력해주세요.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setAlertMessage(validationMessage);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          loginId: form.loginId.trim(),
          password: form.password,
          phoneNumber: form.phoneNumber.trim(),
          role: form.role,
        }),
      });

      const result = await response.json();

      if (response.status === 409) {
        setAlertMessage(
          result.message || "이미 사용 중인 아이디입니다."
        );
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "회원가입에 실패했습니다."
        );
      }

      setSignupCompleted(true);
      setAlertMessage(
        result.message || "회원가입이 완료되었습니다."
      );
    } catch (error) {
      setAlertMessage(
        error.message || "서버와 통신할 수 없습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeAlert = () => {
    setAlertMessage("");

    if (signupCompleted) {
      setSignupCompleted(false);
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

          <p className="signup-header-title">회원가입</p>
        </header>

        <section className="signup-content">
          <div className="signup-fields">
            <div className="signup-field">
              <div className="signup-label-row">
                <label
                  className="signup-label"
                  htmlFor="signup-login-id"
                >
                  아이디
                </label>

                <span className="signup-required">필수</span>
              </div>

              <input
                className="signup-input"
                id="signup-login-id"
                type="text"
                name="loginId"
                value={form.loginId}
                onChange={handleChange}
                placeholder="4~12자 영문·숫자"
                maxLength={12}
                autoComplete="username"
              />
            </div>

            <div className="signup-field">
              <div className="signup-label-row">
                <label
                  className="signup-label"
                  htmlFor="signup-password"
                >
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
                placeholder="8자 이상 입력"
                autoComplete="new-password"
              />
            </div>

            <div className="signup-field">
              <div className="signup-label-row">
                <span className="signup-label">유형</span>

                <span className="signup-required">필수</span>
              </div>

              <div className="signup-type-buttons">
                <button
                  className={`signup-type-button ${
                    form.role === "STUDENT"
                      ? "signup-type-button--selected"
                      : ""
                  }`}
                  type="button"
                  onClick={() => selectUserType("STUDENT")}
                >
                  학생
                </button>

                <button
                  className={`signup-type-button ${
                    form.role === "OWNER"
                      ? "signup-type-button--selected"
                      : ""
                  }`}
                  type="button"
                  onClick={() => selectUserType("OWNER")}
                >
                  사장님
                </button>
              </div>
            </div>

            <div className="signup-field">
              <div className="signup-label-row">
                <label
                  className="signup-label"
                  htmlFor="signup-phone"
                >
                  전화번호
                </label>

                <span className="signup-required">필수</span>
              </div>

              <input
                className="signup-input signup-phone-input"
                id="signup-phone"
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="01012345678"
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
            {loading ? "처리 중..." : "가입하기"}
          </button>
        </footer>
      </form>

      <AlertModal
        message={alertMessage}
        onClose={closeAlert}
      />
    </main>
  );
}