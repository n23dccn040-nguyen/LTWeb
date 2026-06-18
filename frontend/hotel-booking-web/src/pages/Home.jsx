import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import HotelCard from "../components/HotelCard";

export default function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    roomType: "",
    checkIn: "",
    checkOut: "",
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = "http://localhost:5154/api";

  const fetchFeaturedHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Hotels/search?pageSize=4`,
      );
      setHotels(response.data.data || response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedHotels();
  }, []);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });
    navigate(`/search?${params.toString()}`);
  };

  const goToDetail = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <div className="home-container">
      <div
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://phuquocxanh.com/vi/wp-content/uploads/2015/09/32319491.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="hero-title">🌴 "Khám Phá Điểm Đến Trong Mơ"</h1>
        <p className="hero-subtitle"> Tìm Kiếm & Đặt Phòng Khách Sạn</p>

        <SearchBar
          filters={filters}
          onInputChange={handleInputChange}
          onSearch={handleSearch}
        />
      </div>

      <div
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.7)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          paddingBottom: "40px",
        }}
      >
        <div
          className="main-content"
          style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
            Khách sạn Nổi bật
          </h2>
          {loading ? (
            <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              Đang tải dữ liệu...
            </p>
          ) : (
            <div
              className="hotel-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    onClick={() => goToDetail(hotel.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <HotelCard
                      hotel={hotel}
                      onOpenModal={() => goToDetail(hotel.id)}
                    />
                  </div>
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#95a5a6",
                    padding: "40px",
                    fontSize: "16px",
                    gridColumn: "1 / -1",
                  }}
                >
                  Chưa có dữ liệu.
                </p>
              )}
            </div>
          )}

          <section style={{ marginTop: "60px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Về Chúng Tôi
            </h2>
            <p
              style={{
                textAlign: "center",
                maxWidth: "800px",
                margin: "0 auto",
                lineHeight: "1.6",
                color: "#555",
              }}
            >
              Chúng tôi tự hào là nền tảng đặt phòng khách sạn hàng đầu, mang
              đến cho bạn trải nghiệm lưu trú tuyệt vời nhất. Với mạng lưới đối
              tác rộng khắp, chúng tôi cam kết cung cấp những lựa chọn phong
              phú, từ khu nghỉ dưỡng sang trọng đến các khách sạn bình dân, phù
              hợp với mọi nhu cầu và ngân sách.
            </p>
          </section>

          <section style={{ marginTop: "60px" }}>
            <h2
              style={{
                textAlign: "center",
                marginBottom: "30px",
                color: "#2c3e50",
              }}
            >
              Đội Ngũ Của Chúng Tôi
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "30px",
                flexWrap: "wrap",
              }}
            >
              {[
                { id: 1, name: "Đặng Phương Nam" },
                { id: 2, name: "Trần Lê Quang Hữu" },
                { id: 3, name: "Ngô Trung Nguyên" },
              ].map((member) => (
                <div
                  key={member.id}
                  style={{
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.95)",
                    padding: "30px 20px",
                    borderRadius: "15px",
                    minWidth: "240px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    borderTop: "4px solid #3498db",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "15px" }}>
                    👤
                  </div>
                  <h3
                    style={{
                      margin: "0",
                      fontSize: "18px",
                      color: "#2c3e50",
                      fontWeight: "bold",
                    }}
                  >
                    {member.name}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              marginTop: "60px",
              padding: "40px",
              background: "#f5f7fa",
              borderRadius: "10px",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Liên Hệ
            </h2>
            <div
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <p>
                <strong>Email:</strong> support@hotelbooking.com
              </p>
              <p>
                <strong>Điện thoại:</strong> 0123 456 789
              </p>
              <p>
                <strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP. HCM
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
