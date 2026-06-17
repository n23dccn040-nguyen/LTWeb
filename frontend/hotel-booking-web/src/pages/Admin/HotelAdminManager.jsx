import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HotelAdminManager() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [isEditing, setIsEditing] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    id: null, name: "", city: "", address: "", description: "", managerId: ""
  });

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1 });
  const [searchCity, setSearchCity] = useState("");

  const API_BASE_URL = "http://localhost:5154/api";

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchCity) params.append("city", searchCity);
      params.append("page", pagination.page);
      params.append("pageSize", pagination.pageSize);

      const response = await axios.get(`${API_BASE_URL}/Hotels/search?${params.toString()}`);
      setHotels(response.data.data || []);
      if (response.data.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          page: response.data.pagination.currentPage
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách sạn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [pagination.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchHotels();
  };

  const saveHotel = async (e) => {
    e.preventDefault();
    try {
      // SỬA Ở ĐÂY: Gán id: 0 thay vì null để Backend (int) hiểu được đây là thêm mới
      const payload = { 
        id: hotelForm.id ? Number(hotelForm.id) : 0, 
        name: hotelForm.name,
        city: hotelForm.city,
        address: hotelForm.address,
        description: hotelForm.description,
        managerId: hotelForm.managerId ? Number(hotelForm.managerId) : null 
      };

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/Hotels/${hotelForm.id}`, payload);
        alert("Cập nhật Khách sạn thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/Hotels`, payload);
        alert("Thêm Khách sạn thành công!");
      }
      setHotelForm({ id: null, name: "", city: "", address: "", description: "", managerId: "" });
      setIsEditing(false);
      fetchHotels();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi lưu Khách sạn!");
    }
  };

  const deleteHotel = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách sạn này? Điều này sẽ xóa toàn bộ phòng và đơn đặt phòng liên quan.")) {
      try {
        await axios.delete(`${API_BASE_URL}/Hotels/${id}`);
        fetchHotels();
      } catch (error) {
        alert("Lỗi khi xóa khách sạn!");
      }
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#e67e22' }}>Quản lý Khách sạn (Toàn hệ thống)</h1>
        <Link to="/admin/dashboard" style={{ padding: '8px 15px', background: '#ccc', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>
          ⬅ Quay lại Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* CỘT TRÁI: FORM THÊM/SỬA */}
        <div style={{ flex: '1', minWidth: '350px' }}>
          <div style={{ background: '#f5f7fa', padding: '20px', borderRadius: '10px' }}>
            <h3>{isEditing ? "Sửa Khách sạn" : "Thêm Khách sạn mới"}</h3>
            <form onSubmit={saveHotel} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label>Tên Khách sạn:</label>
                <input required type="text" value={hotelForm.name} onChange={e => setHotelForm({...hotelForm, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label>Thành phố:</label>
                <input required type="text" value={hotelForm.city} onChange={e => setHotelForm({...hotelForm, city: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label>Địa chỉ chi tiết:</label>
                <input required type="text" value={hotelForm.address} onChange={e => setHotelForm({...hotelForm, address: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label>Mô tả:</label>
                <textarea value={hotelForm.description} onChange={e => setHotelForm({...hotelForm, description: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px' }} />
              </div>
              <div>
                <label>ID Quản lý (HotelManager ID):</label>
                <input type="number" placeholder="Để trống nếu chưa có" value={hotelForm.managerId || ""} onChange={e => setHotelForm({...hotelForm, managerId: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', flex: 1, cursor: 'pointer', fontWeight: 'bold' }}>{isEditing ? "Lưu thay đổi" : "Thêm Khách sạn"}</button>
                {isEditing && <button type="button" onClick={() => { setIsEditing(false); setHotelForm({ id: null, name: "", city: "", address: "", description: "", managerId: "" }); }} style={{ padding: '10px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Hủy</button>}
              </div>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH KHÁCH SẠN */}
        <div style={{ flex: '2', minWidth: '500px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Lọc theo thành phố..." 
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
            />
            <button type="submit" style={{ padding: '8px 15px', background: 'var(--neon-blue)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Lọc</button>
          </form>

          {loading ? (
             <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {hotels.length > 0 ? hotels.map(h => (
                <div key={h.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0' }}>{h.name}</h3>
                      <p style={{ margin: '0 0 5px 0', color: '#555' }}>📍 {h.city} - {h.address}</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#7f8c8d' }}>Manager ID: {h.managerId || 'Chưa gán'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => { setIsEditing(true); setHotelForm({ id: h.id, name: h.name, city: h.city, address: h.address, description: h.description, managerId: h.managerId || "" }); window.scrollTo(0,0); }} style={{ padding: '5px 10px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Sửa</button>
                      <button onClick={() => deleteHotel(h.id)} style={{ padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Xóa</button>
                    </div>
                  </div>
                </div>
              )) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Không tìm thấy khách sạn nào.</p>
              )}
            </div>
          )}

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
              <span style={{ padding: '8px 16px', background: '#e67e22', color: 'white', borderRadius: '5px' }}>
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
        </div>
      </div>
    </div>
  );
}
