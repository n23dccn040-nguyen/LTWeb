import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Search from "./pages/Tourist/Search";
import HotelDetail from "./pages/Tourist/HotelDetail";
import Profile from "./pages/Tourist/Profile";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import RoomManager from "./pages/Manager/RoomManager";
import BookingManager from "./pages/Manager/BookingManager";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManager from "./pages/Admin/UserManager";
import HotelAdminManager from "./pages/Admin/HotelAdminManager";

// --- GIAO DIỆN TRANG GIỚI THIỆU (ABOUT) VỚI BACKGROUND PARALLAX ---
const About = () => {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.7)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        paddingBottom: "60px",
      }}
    >
      <div
        style={{
          padding: "60px 20px",
          maxWidth: "1000px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Tiêu đề chính */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{ color: "#2c3e50", fontSize: "36px", marginBottom: "15px" }}
          >
            Về Dự Án Của Chúng Tôi
          </h1>
          <div
            style={{
              width: "80px",
              height: "4px",
              backgroundColor: "#3498db",
              margin: "0 auto",
              borderRadius: "2px",
            }}
          ></div>
        </div>

        {/* Box Giới thiệu chung */}
        <div
          style={{
            backgroundColor: "rgba(248, 249, 250, 0.95)",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{ color: "#34495e", marginBottom: "20px", fontSize: "24px" }}
          >
            Khởi Nguồn Dự Án
          </h2>
          <p
            style={{
              lineHeight: "1.8",
              color: "#555",
              fontSize: "16px",
              marginBottom: "15px",
            }}
          >
            Chào mừng bạn đến với hệ thống đặt phòng khách sạn trực tuyến – một
            sản phẩm tâm huyết ra đời từ Đồ án Lập trình Web Nâng cao. Hệ thống
            được thiết kế và phát triển bởi đội ngũ gồm 3 thành viên đam mê công
            nghệ.
          </p>
          <p style={{ lineHeight: "1.8", color: "#555", fontSize: "16px" }}>
            Bằng việc ứng dụng những công nghệ kiến trúc hiện đại nhất hiện nay
            với <strong>ASP.NET Core Web API</strong> xử lý dữ liệu mạnh mẽ phía
            Backend và <strong>ReactJS</strong> mang đến giao diện tương tác
            mượt mà phía Frontend, chúng tôi mong muốn tạo ra một sản phẩm không
            chỉ đáp ứng tiêu chí học thuật mà còn có khả năng ứng dụng vào thực
            tế.
          </p>
        </div>

        {/* Box Tính năng cốt lõi */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            borderTop: "4px solid #2ecc71",
          }}
        >
          <h2
            style={{
              color: "#27ae60",
              marginBottom: "25px",
              fontSize: "24px",
              textAlign: "center",
            }}
          >
            Hệ Thống Của Chúng Tôi Giúp Gì Cho Bạn?
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "30px",
              fontSize: "16px",
            }}
          >
            Mục tiêu cốt lõi của dự án là giải quyết những khó khăn của người
            dùng khi tìm kiếm nơi lưu trú:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
            }}
          >
            <div
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #eaeded",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ color: "#2980b9", marginBottom: "10px" }}>
                🔍 Tìm Kiếm Thông Minh
              </h3>
              <p style={{ color: "#7f8c8d", lineHeight: "1.6" }}>
                Bộ lọc linh hoạt giúp tìm đúng khách sạn theo thành phố, khoảng
                giá và thời gian mong muốn chỉ trong tích tắc.
              </p>
            </div>

            <div
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #eaeded",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ color: "#2980b9", marginBottom: "10px" }}>
                💵 Tối Ưu Chi Phí
              </h3>
              <p style={{ color: "#7f8c8d", lineHeight: "1.6" }}>
                Dễ dàng đối chiếu, so sánh và lựa chọn loại phòng phù hợp nhất
                từ phân khúc bình dân đến resort 5 sao.
              </p>
            </div>

            <div
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #eaeded",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ color: "#2980b9", marginBottom: "10px" }}>
                ⚡ Đặt Phòng Siêu Tốc
              </h3>
              <p style={{ color: "#7f8c8d", lineHeight: "1.6" }}>
                Quy trình được tối giản hóa, loại bỏ các bước rườm rà, giúp giữ
                phòng nhanh chóng và quản lý booking dễ dàng.
              </p>
            </div>

            <div
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #eaeded",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ color: "#2980b9", marginBottom: "10px" }}>
                🛡️ Quản Trị Toàn Diện
              </h3>
              <p style={{ color: "#7f8c8d", lineHeight: "1.6" }}>
                Hệ thống Dashboard dành riêng cho Admin và Manager giúp theo dõi
                doanh thu, quản lý khách sạn và người dùng chặt chẽ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// ----------------------------------------------

function Navigation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      className="luxury-nav"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" className="nav-logo">
          <span style={{ color: "white" }}></span>{" "}
          <span style={{ color: "var(--neon-blue)" }}>HotelBooking</span>
        </Link>
        <Link to="/"> Trang chủ</Link>
        <Link to="/search"> Tìm kiếm</Link>
        {user?.role === "HotelManager" && (
          <Link
            to="/manager/dashboard"
            style={{ color: "var(--neon-blue)", fontWeight: "bold" }}
          >
            ⚙️ Quản lý Khách sạn
          </Link>
        )}
        {user?.role === "Admin" && (
          <Link
            to="/admin/dashboard"
            style={{ color: "#e74c3c", fontWeight: "bold" }}
          >
            🛡️ Admin Dashboard
          </Link>
        )}
        <Link to="/about">Giới thiệu</Link>
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {user ? (
          <>
            <Link to="/profile" style={{ color: "white" }}>
              Xin chào, <strong>{user.fullName}</strong>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid white",
                padding: "5px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                background: "var(--neon-blue)",
                padding: "8px 20px",
                borderRadius: "20px",
                color: "white",
              }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              style={{
                border: "1px solid var(--neon-blue)",
                padding: "8px 20px",
                borderRadius: "20px",
                color: "var(--neon-blue)",
              }}
            >
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/hotel/:hotelId/rooms" element={<RoomManager />} />
        <Route
          path="/manager/hotel/:hotelId/bookings"
          element={<BookingManager />}
        />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManager />} />
        <Route path="/admin/hotels" element={<HotelAdminManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
