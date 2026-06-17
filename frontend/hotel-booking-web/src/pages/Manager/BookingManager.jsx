import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function BookingManager() {
  const { hotelId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. State quản lý bộ lọc danh sách đơn đặt phòng
  const [filters, setFilters] = useState({ status: "", searchName: "" });
  const [sortOptions, setSortOptions] = useState({ sortBy: "id", sortOrder: "desc" });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1 });

  // 2. State quản lý Khoảng thời gian thống kê & Số liệu 4 Thẻ
  const [statsDates, setStatsDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // Mặc định 30 ngày trước
    endDate: new Date().toISOString().split('T')[0] // Mặc định là ngày hôm nay
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    cancelledBookings: 0,
    pendingBookings: 0
  });

  const API_BASE_URL = "http://localhost:5154/api";

  // Hàm tải dữ liệu thống kê 4 thẻ dựa theo khoảng thời gian
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Bookings/hotel/${hotelId}/statistics`, {
        params: {
          startDate: statsDates.startDate,
          endDate: statsDates.endDate
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };

  // Hàm tải danh sách các đơn đặt phòng (có phân trang, lọc, sắp xếp)
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.searchName) params.append("searchName", filters.searchName);
      params.append("sortBy", sortOptions.sortBy);
      params.append("sortOrder", sortOptions.sortOrder);
      params.append("page", pagination.page);
      params.append("pageSize", pagination.pageSize);

      const response = await axios.get(`${API_BASE_URL}/Bookings/hotel/${hotelId}?${params.toString()}`);
      setBookings(response.data.data || []);
      if (response.data.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn đặt phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái đơn đặt phòng (Duyệt đơn / Nhận phòng / Hủy)
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/Bookings/${bookingId}`, { status: newStatus });
      alert("Cập nhật trạng thái đơn thành công!");
      fetchBookings();
      fetchStatistics(); // Tải lại cả bảng thống kê vì trạng thái đơn đã đổi
    } catch (error) {
      console.error(error);
      alert("Không thể cập nhật trạng thái đơn.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, filters.status, sortOptions]);

  useEffect(() => {
    fetchStatistics();
  }, [statsDates]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchBookings();
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Tiêu đề trang */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--neon-blue, #00a8ff)', margin: 0 }}>📅 Quản lý Đặt Phòng & Báo Cáo</h1>
        <Link to="/manager/dashboard" style={{ padding: '8px 15px', background: '#e2e8f0', color: '#475569', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          ⬅ Quay lại Dashboard
        </Link>
      </div>

      {/* KHU VỰC THỐNG KÊ (Hạng mục giáo viên yêu cầu) */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>📊 Thống kê hiệu suất theo khoảng thời gian</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="date" 
              value={statsDates.startDate} 
              onChange={e => setStatsDates({...statsDates, startDate: e.target.value})}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
            <span style={{ color: '#64748b' }}>đến</span>
            <input 
              type="date" 
              value={statsDates.endDate} 
              onChange={e => setStatsDates({...statsDates, endDate: e.target.value})}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        {/* Bố cục 4 Thẻ hiển thị số liệu thống kê */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#ebf8ff', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #3182ce' }}>
            <p style={{ margin: '0 0 5px 0', color: '#2b6cb0', fontWeight: '600' }}>Tổng Đơn Đặt</p>
            <h2 style={{ margin: 0, color: '#2b6cb0', fontSize: '28px' }}>{stats.totalBookings} đơn</h2>
          </div>
          
          <div style={{ background: '#f0fff4', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #38a169' }}>
            <p style={{ margin: '0 0 5px 0', color: '#2f855a', fontWeight: '600' }}>Doanh Thu Dự Kiến</p>
            <h2 style={{ margin: 0, color: '#2f855a', fontSize: '24px' }}>{stats.totalRevenue?.toLocaleString()} VNĐ</h2>
          </div>

          <div style={{ background: '#fffaf0', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #dd6b20' }}>
            <p style={{ margin: '0 0 5px 0', color: '#c05621', fontWeight: '600' }}>Đơn Chờ Duyệt</p>
            <h2 style={{ margin: 0, color: '#c05621', fontSize: '28px' }}>{stats.pendingBookings} đơn</h2>
          </div>

          <div style={{ background: '#fff5f5', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #e53e3e' }}>
            <p style={{ margin: '0 0 5px 0', color: '#c53030', fontWeight: '600' }}>Đơn Đã Hủy</p>
            <h2 style={{ margin: 0, color: '#c53030', fontSize: '28px' }}>{stats.cancelledBookings} đơn</h2>
          </div>
        </div>
      </div>

      {/* THANH BỘ LỌC & TÌM KIẾM DANH SÁCH */}
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '25px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '300px' }}>
          <input 
            type="text" 
            placeholder="Tìm theo tên khách hàng..."
            value={filters.searchName}
            onChange={e => setFilters({...filters, searchName: e.target.value})}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1 }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: 'var(--neon-blue, #00a8ff)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Tìm kiếm</button>
        </form>

        <div style={{ display: 'flex', gap: '15px' }}>
          <select 
            value={filters.status} 
            onChange={e => { setFilters({...filters, status: e.target.value}); setPagination(prev => ({...prev, page: 1})); }}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="">-- Tất cả trạng thái --</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="CheckedIn">Đã nhận phòng</option>
            <option value="Cancelled">Đã hủy</option>
          </select>

          <select 
            value={`${sortOptions.sortBy}-${sortOptions.sortOrder}`} 
            onChange={e => {
              const [field, order] = e.target.value.split('-');
              setSortOptions({ sortBy: field, sortOrder: order });
            }}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="id-desc">Đơn mới nhất</option>
            <option value="id-asc">Đơn cũ nhất</option>
          </select>
        </div>
      </div>

      {/* BẢNG DANH SÁCH ĐƠN ĐẶT PHÒNG */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontWeight: 'bold' }}>Đang tải danh sách đặt phòng...</div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '14px' }}>Mã đơn</th>
                <th style={{ padding: '14px' }}>Khách hàng</th>
                <th style={{ padding: '14px' }}>Số điện thoại</th>
                <th style={{ padding: '14px' }}>Ngày ở (Check-in/out)</th>
                <th style={{ padding: '14px' }}>Số lượng</th>
                <th style={{ padding: '14px' }}>Tổng tiền</th>
                <th style={{ padding: '14px' }}>Trạng thái</th>
                <th style={{ padding: '14px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: 'bold' }}>#{b.id}</td>
                  <td style={{ padding: '14px' }}>{b.guestName}</td>
                  <td style={{ padding: '14px' }}>{b.guestPhone}</td>
                  <td style={{ padding: '14px', fontSize: '13px' }}>
                    {new Date(b.checkInDate).toLocaleDateString('vi-VN')} ➡️ {new Date(b.checkOutDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: '14px' }}>{b.roomQuantity} phòng</td>
                  <td style={{ padding: '14px', fontWeight: 'bold', color: 'var(--neon-blue, #00a8ff)' }}>{b.totalPrice?.toLocaleString()} VNĐ</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold',
                      background: b.status === 'Pending' ? '#fef3c7' : b.status === 'Confirmed' ? '#e0f2fe' : b.status === 'CheckedIn' ? '#dcfce7' : '#fee2e2',
                      color: b.status === 'Pending' ? '#d97706' : b.status === 'Confirmed' ? '#0284c7' : b.status === 'CheckedIn' ? '#16a34a' : '#dc2626',
                    }}>
                      {b.status === 'Pending' ? 'Chờ duyệt' : b.status === 'Confirmed' ? 'Đã xác nhận' : b.status === 'CheckedIn' ? 'Đã ở' : 'Đã hủy'}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    {b.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => handleUpdateStatus(b.id, 'Confirmed')} style={{ padding: '4px 8px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Duyệt</button>
                        <button onClick={() => handleUpdateStatus(b.id, 'Cancelled')} style={{ padding: '4px 8px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Hủy</button>
                      </div>
                    )}
                    {b.status === 'Confirmed' && (
                      <button onClick={() => handleUpdateStatus(b.id, 'CheckedIn')} style={{ padding: '4px 8px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Nhận phòng</button>
                    )}
                    {b.status === 'CheckedIn' && <span style={{ color: '#94a3b8', fontSize: '12px' }}>Không có thao tác</span>}
                    {b.status === 'Cancelled' && <span style={{ color: '#94a3b8', fontSize: '12px' }}>Không có thao tác</span>}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Không tìm thấy đơn đặt phòng nào phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ĐIỀU HƯỚNG PHÂN TRANG */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '25px' }}>
          <button 
            onClick={() => setPagination({...pagination, page: pagination.page - 1})}
            disabled={pagination.page === 1}
            style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: pagination.page === 1 ? '#e2e8f0' : 'white', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer' }}
          >
            Trang trước
          </button>
          <span style={{ padding: '8px 14px', background: 'var(--neon-blue, #00a8ff)', color: 'white', borderRadius: '6px', fontWeight: 'bold' }}>
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <button 
            onClick={() => setPagination({...pagination, page: pagination.page + 1})}
            disabled={pagination.page === pagination.totalPages}
            style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: pagination.page === pagination.totalPages ? '#e2e8f0' : 'white', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer' }}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}