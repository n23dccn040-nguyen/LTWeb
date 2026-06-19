import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function HotelAdminManager() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allHotels, setAllHotels] = useState([]);

  // Forms state
  const [isEditing, setIsEditing] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    id: null, name: "", city: "", address: "", description: "", managerId: ""
  });

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 1 });
  const [searchCity, setSearchCity] = useState("");
  const [searchName, setSearchName] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const API_BASE_URL = "http://localhost:5154/api";

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", 1);
      params.append("pageSize", 1000); // Get all hotels for client-side filtering

      const response = await axios.get(`${API_BASE_URL}/Hotels/search?${params.toString()}`);
      let data = response.data.data || [];
      setAllHotels(data);
      applyFiltersAndSort(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách sạn:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = (data) => {
    // Apply search filters
    if (searchCity) {
      data = data.filter(h => h.city?.toLowerCase().includes(searchCity.toLowerCase()));
    }
    if (searchName) {
      data = data.filter(h => h.name?.toLowerCase().includes(searchName.toLowerCase()));
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "name") {
        aVal = a.name;
        bVal = b.name;
      } else if (sortBy === "city") {
        aVal = a.city;
        bVal = b.city;
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
    
    setHotels(data.slice(startIdx, endIdx));
    setPagination(prev => ({ ...prev, totalPages }));
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (allHotels.length > 0) {
      setPagination(prev => ({ ...prev, page: 1 }));
      applyFiltersAndSort(allHotels);
    }
  }, [searchCity, searchName, sortBy, sortOrder]);

  useEffect(() => {
    if (allHotels.length > 0) {
      applyFiltersAndSort(allHotels);
    }
  }, [pagination.page]);

  const handleSearch = (e) => {
    e.preventDefault();
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
        Swal.fire({
  icon: 'success',
  title: 'Thành công!',
  text: 'Khách sạn đã được cập nhật.',
  timer: 1500, // Tự động tắt sau 1.5 giây
  showConfirmButton: false // Ẩn nút OK cho mượt
});
      } else {
        await axios.post(`${API_BASE_URL}/Hotels`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Khách sạn đã được thêm mới.',
          timer: 1500,
          showConfirmButton: false
        });
      }
      setHotelForm({ id: null, name: "", city: "", address: "", description: "", managerId: "" });
      setIsEditing(false);
      fetchHotels();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Thất bại!',
        text: "Có lỗi xảy ra khi lưu Khách sạn!",
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  const deleteHotel = async (id) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Hành động này sẽ xóa vĩnh viễn dữ liệu và không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c', // Màu đỏ cho nút Xóa
      cancelButtonColor: '#95a5a6',  // Màu xám cho nút Hủy
      confirmButtonText: 'Xác nhận xóa',
      cancelButtonText: 'Hủy bỏ'
    }).then(async (result) => {
      // 2. Nếu người dùng bấm nút " Xóa "
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/Hotels/${id}`);

          // Thông báo xóa thành công
          Swal.fire('Đã xóa!', 'Dữ liệu đã được dọn sạch.', 'success');

          // Gọi lại hàm tải danh sách
          fetchHotels();
          setSelectedHotel(null);
          setRooms([]);
        } catch (error) {
          Swal.fire('Lỗi!', 'Không thể xóa do dữ liệu đang bị ràng buộc.', 'error');
        }
      }
    });
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Tìm theo tên khách sạn..." 
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <input 
              type="text" 
              placeholder="Tìm theo thành phố..." 
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="name">Sắp xếp: Tên</option>
              <option value="city">Sắp xếp: Thành phố</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', background: 'var(--neon-blue)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {sortOrder === 'asc' ? '⬆️ Tăng dần' : '⬇️ Giảm dần'}
            </button>
          </div>

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
