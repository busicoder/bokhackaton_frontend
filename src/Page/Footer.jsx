import { useLocation, useNavigate } from "react-router-dom";
import "./footer.css";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "홈", path: "/" },
    { label: "마이", path: "/mypage" },
  ];

  const isActive = (path) => {
    if (path === "/reserve") return location.pathname === "/"; // reserve를 홈으로 처리
    return location.pathname.startsWith(path);
  };

  return (
    <footer className="footer-nav">
      {navItems.map((item) => (
        <div
          key={item.path}
          className={`footer-item ${isActive(item.path) ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </div>
      ))}
    </footer>
  );
}

export default Footer;