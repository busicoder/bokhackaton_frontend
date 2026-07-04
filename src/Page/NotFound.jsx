import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "calc(100vh - var(--footer-height))",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          color: "var(--highlight-color)",
          margin: 0,
        }}
      >
        404
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "var(--normal-color)",
          margin: 0,
        }}
      >
        페이지를 찾을 수 없습니다.
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "var(--highlight-color)",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default NotFound;