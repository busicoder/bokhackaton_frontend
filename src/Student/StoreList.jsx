import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";
import { MapPin } from "lucide-react";
import AlertModal from "../Page/Alert";
import "react-datepicker/dist/react-datepicker.css";
import "./StoreList.css";
import { fetchStores } from "../Util/GetStores";
import Store1 from "../assets/BeerIcon.png";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../Util/formatDate";

const STORE_IMAGES = [
  "🍺", "🔥", "🍻", "🍶", "🍾", "🍸"
];


export default function StoreListPage() {
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
  const [keyword, setKeyword] = useState("");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [date, setDate] = useState(tomorrow);
  const [headcount, setHeadcount] = useState(4);//기본 인원수 4
  const [stores, setStores] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  // const navigate = useNavigate();

  const getStoreThumbnail = (storeId) => {
    return STORE_IMAGES[
      (storeId - 1) % STORE_IMAGES.length
    ];
  };

  const searchStores = async () => {
    if (!date) {
      setAlertMessage("날짜를 선택해주세요.");
      return;
    }

    try {
      const formattedDate = date.toISOString().split("T")[0];

      const data = await fetchStores(
        formattedDate,
        headcount
      );
      // console.log(data);

      setStores(data.stores);
    } catch (error) {
      setAlertMessage(
        error.message || "목록 조회에 실패했습니다."
      );
    }
  };
  useEffect(() => { searchStores(); }, []);
  return (
    <main className="reserve-page">
      <section className="reserve-container">
        <header className="reserve-header">
          <span className="reserve-logo">🍺</span>
          <h1>짠</h1>
        </header>

        <section className="reserve-search-bar">
          <input
            type="text"
            className="reserve-search-input"
            placeholder="술집 이름 검색"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />

          <button
            className="reserve-search-button"
            onClick={searchStores}
          >
            검색
          </button>
        </section>

        <section className="reserve-filter-row">
          <label className="reserve-filter-card">
            <span>날짜</span>

            <div className="reserve-date-picker-wrapper">
              <DatePicker
                selected={date}
                onChange={(selectedDate) => setDate(selectedDate)}
                minDate={tomorrow}
                dateFormat="yyyy.MM.dd"
                className="reserve-date-picker"
              />
              <CalendarDays size={18} />
            </div>
          </label>

          <label className="reserve-filter-card">
            <span>인원</span>

            <div className="reserve-headcount-control">
              <input
                type="number"
                min="1"
                max="40"
                value={headcount}
                className="reserve-headcount-input"
                onChange={(event) => {
                  const value = Number(event.target.value);

                  if (value >= 1 && value <= 40) {
                    setHeadcount(value);
                  }

                  if (event.target.value === "") {
                    setHeadcount("");
                  }
                }}
              />

              <button
                type="button"
                className="reserve-headcount-button plusbutton"
                onClick={() =>
                  setHeadcount((prev) => Math.min(40, Number(prev) + 1))
                }
              >
                +
              </button>
              <button
                type="button"
                className="reserve-headcount-button"
                onClick={() =>
                  setHeadcount((prev) => Math.max(1, prev - 1))
                }
              >
                −
              </button>
            </div>
          </label>
        </section>

        <section className="reserve-results">
          <div className="reserve-results-heading">
            <h2>근처 인기 술집</h2>
            <span>{stores.length}개</span>
          </div>

          <div className="reserve-store-list">
            {stores.map((store) => (
              <button
                key={store.id}
                className="reserve-store-card"
                onClick={() => {
                  const formattedDate = formatDate(date);
                  navigate(`/reserve/${store.id}`, {
                    state: {
                      date: formattedDate,
                      headcount,
                    },
                  });
                }}
              >
                <div className="reserve-store-thumbnail">
                  <span>{getStoreThumbnail(store.id)}</span>
                </div>

                <div className="reserve-store-content">
                  <strong>{store.name}</strong>

                  <div className="reserve-store-bottom">
                    <div className="mappin-wrapper">
                      <MapPin className="mappin" />
                      <span>{store.address}</span>
                    </div>
                    <small>
                      최대 {store.remainingSeatsMax}석 가능
                    </small>
                  </div>
                </div>
              </button>
            ))}
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