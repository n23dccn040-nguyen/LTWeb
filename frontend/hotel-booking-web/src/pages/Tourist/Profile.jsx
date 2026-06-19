import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // States for pagination, search, sort, filter
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("checkInDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("");

  const API_BASE_URL = "http://localhost:5154/api";

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let filteredBookings = await axios.get(`${API_BASE_URL}/Bookings/user/${user.id}`);
      let data = filteredBookings.data || [];
      
      // Apply search filter
      if (searchTerm) {
        data = data.filter(b => 
          b.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.roomTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.guestName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply status filter
      if (filterStatus) {
        data = data.filter(b => b.status === filterStatus);
      }
      
      // Apply sorting
      data.sort((a, b) => {
        let aVal, bVal;
        if (sortBy === "checkInDate") {
          aVal = new Date(a.checkInDate);
          bVal = new Date(b.checkInDate);
        } else if (sortBy === "totalPrice") {
          aVal = a.totalPrice;
          bVal = b.totalPrice;
        } else if (sortBy === "status") {
          aVal = a.status;
          bVal = b.status;
        }
        
        if (sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      // Apply pagination
      const totalPages = Math.ceil(data.length / pagination.pageSize);
      const startIdx = (pagination.page - 1) * pagination.pageSize;
      const endIdx = startIdx + pagination.pageSize;
      
      setBookings(data.slice(startIdx, endIdx));
      setPagination(prev => ({ ...prev, totalPages }));
    } catch (error) {
      console.error("Lỗi khi tải danh sách đặt phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchBookings();
    }
  }, [searchTerm, filterStatus, sortBy, sortOrder, user]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [pagination.page, user]);

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
          
          {/* Search, Filter, Sort Controls */}
          <div style={{ background: '#f5f7fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>
              <input 
                type="text" 
                placeholder="Tìm theo khách sạn, phòng, khách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Pending">Chờ duyệt</option>
                <option value="Confirmed">Đã xác nhận</option>
                <option value="CheckedIn">Đã nhận phòng</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
            <div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="checkInDate">Sắp xếp: Ngày nhận phòng</option>
                <option value="totalPrice">Sắp xếp: Giá tiền</option>
                <option value="status">Sắp xếp: Trạng thái</option>
              </select>
            </div>
            <div>
              <button 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', background: '#3498db', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {sortOrder === 'asc' ? '⬆️ Tăng dần' : '⬇️ Giảm dần'}
              </button>
            </div>
          </div>

          {bookings.length > 0 ? (
            <>
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
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
                  <button 
                    onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                    disabled={pagination.page === 1}
                    style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', background: pagination.page === 1 ? '#eee' : 'white', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    Trang trước
                  </button>
                  <span style={{ padding: '8px 16px', background: '#3498db', color: 'white', borderRadius: '5px' }}>
                    Trang {pagination.page} / {pagination.totalPages}
                  </span>
                  <button 
                    onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                    disabled={pagination.page === pagination.totalPages}
                    style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', background: pagination.page === pagination.totalPages ? '#eee' : 'white', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ marginTop: '20px', color: '#666' }}>Bạn chưa có lịch sử đặt phòng nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
