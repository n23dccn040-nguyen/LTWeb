import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // State quản lý form đổi mật khẩu
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "Admin") {
      alert("Chỉ Admin mới có quyền truy cập trang này!");
      navigate("/");
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5154/api/Auth/change-password", {
        userId: user.id,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      alert("Đổi mật khẩu thành công!");
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setShowPasswordForm(false);
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi đổi mật khẩu.");
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#e74c3c' }}>🛡️ Admin Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        
        <div style={{ border: '1px solid #eee', borderRadius: '10px', padding: '30px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: '#fdfbfb' }}>
          <h2 style={{ margin: '0 0 15px 0' }}>👥 Quản lý Người Dùng</h2>
          <p style={{ color: '#555', marginBottom: '20px' }}>Xem danh sách, phân quyền, Khóa/Mở khóa tài khoản.</p>
          <Link to="/admin/users" style={{ display: 'inline-block', padding: '10px 20px', background: '#3498db', color: 'white', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>Vào trang Quản lý</Link>
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: '10px', padding: '30px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: '#fdfbfb' }}>
          <h2 style={{ margin: '0 0 15px 0' }}>🏨 Quản lý Khách Sạn</h2>
          <p style={{ color: '#555', marginBottom: '20px' }}>Thêm, Sửa, Xóa khách sạn trên toàn hệ thống.</p>
          <Link to="/admin/hotels" style={{ display: 'inline-block', padding: '10px 20px', background: '#e67e22', color: 'white', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>Vào trang Quản lý</Link>
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: '10px', padding: '30px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: '#fdfbfb' }}>
          <h2 style={{ margin: '0 0 15px 0' }}>🔑 Đổi Mật Khẩu</h2>
          <p style={{ color: '#555', marginBottom: '20px' }}>Đổi mật khẩu tài khoản Quản trị viên (Admin).</p>
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} style={{ padding: '10px 20px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            {showPasswordForm ? "Đóng" : "Đổi mật khẩu"}
          </button>
        </div>
      </div>

      {showPasswordForm && (
        <div style={{ marginTop: '30px', background: 'white', padding: '25px', borderRadius: '10px', border: '1px solid #ddd', maxWidth: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Đổi mật khẩu</h3>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="password" placeholder="Mật khẩu cũ" required value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="Mật khẩu mới" required value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ padding: '10px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Xác nhận đổi</button>
          </form>
        </div>
      )}
    </div>
  );
}