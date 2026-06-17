import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5154/api";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Bookings/user/${parsedUser.id}`);
        setBookings(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đặt phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return <span style={{ color: '#f39c12', fontWeight: 'bold' }}>Chờ duyệt</span>;
      case 'Confirmed': return <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Đã xác nhận</span>;
      case 'CheckedIn': return <span style={{ color: '#2980b9', fontWeight: 'bold' }}>Đã nhận phòng</span>;
      case 'Cancelled': return <span style={{ color: '#c0392b', fontWeight: 'bold' }}>Đã hủy</span>;
      default: return status;
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn đặt phòng này không?")) {
      try {
        // Cập nhật trạng thái thành Cancelled
        await axios.put(`${API_BASE_URL}/Bookings/${bookingId}`, { status: "Cancelled" });
        alert("Đã hủy đơn đặt phòng.");
        // Reload lại danh sách
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
      } catch (error) {
        console.error("Lỗi khi hủy phòng:", error);
        alert("Không thể hủy phòng lúc này.");
      }
    }
  };
  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Đang tải thông tin...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Hồ sơ của tôi</h1>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px', background: '#f9f9f9', padding: '20px', borderRadius: '10px', alignSelf: 'flex-start' }}>
          <h2>Thông tin cá nhân</h2>
          <div style={{ marginTop: '20px' }}>
            <p><strong>Họ và tên:</strong> {user?.fullName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Vai trò:</strong> {user?.role}</p>
          </div>
        </div>

        <div style={{ flex: '2', minWidth: '500px' }}>
          <h2>Lịch sử đặt phòng</h2>
          {bookings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              {bookings.map((booking) => (
                <div key={booking.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>{booking.hotelName} - {booking.roomTypeName}</h3>
                    <div>{getStatusLabel(booking.status)}</div>
                  </div>
                  <p style={{ margin: '5px 0', color: '#555' }}>
                    <strong>Ngày nhận phòng:</strong> {new Date(booking.checkInDate).toLocaleDateString()} | 
                    <strong> Ngày trả phòng:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                  <p style={{ margin: '5px 0', color: '#555' }}>
                    <strong>Số lượng phòng:</strong> {booking.roomQuantity} | 
                    <strong> Tên khách:</strong> {booking.guestName}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px', color: 'var(--neon-blue)' }}>
                      Tổng tiền: {booking.totalPrice?.toLocaleString()} VNĐ
                    </p>
                    {booking.status === 'Pending' && (
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        style={{ padding: '8px 15px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        Hủy đặt phòng
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: '20px', color: '#666' }}>Bạn chưa có lịch sử đặt phòng nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
