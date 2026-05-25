import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

// Khởi tạo nhanh trang giới thiệu đơn giản
const About = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>ℹ️ Giới thiệu Dự án</h1>
    <p>Hệ thống đặt phòng khách sạn trực tuyến - Đồ án lập trình Web nâng cao.</p>
    <p>Phát triển bởi Nhóm 3 thành viên sử dụng ASP.NET Core Web API & ReactJS.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* Thanh Menu điều hướng phía trên cùng website */}
      <nav style={{ 
        padding: '15px 20px', 
        background: '#2c3e50', 
        display: 'block',
        marginBottom: '20px' 
      }}>
        <Link to="/" style={{ marginRight: '20px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Trang chủ</Link>
        <Link to="/about" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>ℹ️ Giới thiệu</Link>
      </nav>

      {/* Khu vực kết xuất nội dung động tùy thuộc vào URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
