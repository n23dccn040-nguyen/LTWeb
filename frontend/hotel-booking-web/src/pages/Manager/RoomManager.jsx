import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function RoomManager() {
  const { hotelId } = useParams();
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [isEditingType, setIsEditingType] = useState(false);
  const [typeForm, setTypeForm] = useState({
    id: null, name: "", price: "", bedType: "", roomView: "", hasBathtub: false, amenities: "", imageUrl: "", hotelId: Number(hotelId)
  });

  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [roomForm, setRoomForm] = useState({
    id: null, roomNumber: "", isMaintenance: false, isAvailable: true, roomTypeId: null
  });

  // State cho quản lý trạng thái phòng theo ngày
  const [showAvailabilityManager, setShowAvailabilityManager] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availabilityDateRange, setAvailabilityDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [availabilityData, setAvailabilityData] = useState([]);

  // State cho thống kê phòng
  const [showStatistics, setShowStatistics] = useState(false);
  const [statsDateRange, setStatsDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [roomStats, setRoomStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  const API_BASE_URL = "http://localhost:5154/api";

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/RoomTypes/hotel/${hotelId}`);
      setRoomTypes(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải loại phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (typeId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Rooms/roomtype/${typeId}`);
      setRooms(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải phòng vật lý:", error);
    }
  };

  const fetchRoomAvailability = async (roomId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Rooms/${roomId}/availability`, {
        params: {
          startDate: availabilityDateRange.startDate,
          endDate: availabilityDateRange.endDate
        }
      });
      setAvailabilityData(response.data.availabilities || []);
    } catch (error) {
      console.error("Lỗi khi tải trạng thái phòng:", error);
    }
  };

  const fetchRoomStatistics = async () => {
    setStatsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Rooms/hotel/${hotelId}/statistics`, {
        params: {
          startDate: statsDateRange.startDate,
          endDate: statsDateRange.endDate
        }
      });
      setRoomStats(response.data.roomStatistics || []);
    } catch (error) {
      console.error("Lỗi khi tải thống kê phòng:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, [hotelId]);

  const handleSelectType = (type) => {
    setSelectedRoomType(type);
    setRoomForm({ ...roomForm, roomTypeId: type.id });
    fetchRooms(type.id);
  };

  // Xử lý Lưu/Cập nhật loại phòng
  const handleTypeSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: typeForm.name,
        price: Number(typeForm.price),
        bedType: typeForm.bedType,
        roomView: typeForm.roomView,
        hasBathtub: Boolean(typeForm.hasBathtub),
        amenities: typeForm.amenities,
        imageUrl: typeForm.imageUrl || "",
        hotelId: Number(hotelId)
      };

      if (isEditingType) {
        await axios.put(`${API_BASE_URL}/RoomTypes/${typeForm.id}`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Dữ liệu đã được cập nhật.',
          timer: 1500, // Tự động tắt sau 1.5 giầy
          showConfirmButton: false // Ẩn nút OK cho mượt
        });
      } else {
        await axios.post(`${API_BASE_URL}/RoomTypes`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Loại phòng mới đã được thêm.',
          timer: 1500,
          showConfirmButton: false
        });
      }

      setTypeForm({ id: null, name: "", price: "", bedType: "", roomView: "", hasBathtub: false, amenities: "", imageUrl: "", hotelId: Number(hotelId) });
      setIsEditingType(false);
      fetchRoomTypes();
      setSelectedRoomType(null);
      setRooms([]);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi lưu Loại phòng!'
      });
    }
  };

  const handleDeleteType = (id) => {
    // 1. Hiển thị Popup cảnh báo
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
          await axios.delete(`${API_BASE_URL}/RoomTypes/${id}`);

          // Thông báo xóa thành công
          Swal.fire('Đã xóa!', 'Dữ liệu đã được dọn sạch.', 'success');

          // Gọi lại hàm tải danh sách
          fetchRoomTypes();
          setSelectedRoomType(null);
          setRooms([]);
        } catch (error) {
          Swal.fire('Lỗi!', 'Không thể xóa do dữ liệu đang bị ràng buộc.', 'error');
        }
      }
    });
  };

  // Xử lý Thêm/Sửa Phòng vật lý cụ thể (Ví dụ: 101, 102)
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomType) {
      alert("Vui lòng chọn một loại phòng trước!");
      return;
    }
    try {
      const payload = {
        id: roomForm.id ? Number(roomForm.id) : 0,
        roomNumber: roomForm.roomNumber,
        isMaintenance: Boolean(roomForm.isMaintenance),
        isAvailable: Boolean(roomForm.isAvailable),
        roomTypeId: Number(selectedRoomType.id)
      };

      if (isEditingRoom) {
        await axios.put(`${API_BASE_URL}/Rooms/${roomForm.id}`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Thông tin phòng đã được cập nhật.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await axios.post(`${API_BASE_URL}/Rooms`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Phòng vật lý mới đã được thêm.',
          timer: 1500,
          showConfirmButton: false
        });
      }

      setRoomForm({ id: null, roomNumber: "", isMaintenance: false, isAvailable: true, roomTypeId: selectedRoomType.id });
      setIsEditingRoom(false);
      fetchRooms(selectedRoomType.id);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi lưu thông tin phòng vật lý.'
      });
    }
  };

  const deleteRoom = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phòng này không?")) {
      try {
        await axios.delete(`${API_BASE_URL}/Rooms/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Phòng đã được xóa.',
          timer: 1500,
          showConfirmButton: false
        });
        fetchRooms(selectedRoomType.id);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi xóa phòng.'
        });
      }
    }
  };

  // Xử lý cập nhật trạng thái bảo trì
  const handleToggleMaintenance = async (roomId, currentStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/Rooms/${roomId}/maintenance`, !currentStatus);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Trạng thái bảo trì đã được cập nhật.',
        timer: 1500,
        showConfirmButton: false
      });
      fetchRooms(selectedRoomType.id);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể cập nhật trạng thái bảo trì.'
      });
    }
  };

  // Xử lý lịch trạng thái phòng theo ngày
  const handleOpenAvailabilityManager = (room) => {
    setSelectedRoom(room);
    setShowAvailabilityManager(true);
    setAvailabilityDateRange({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    fetchRoomAvailability(room.id);
  };

  const handleUpdateAvailability = async () => {
    if (!selectedRoom) return;

    try {
      const updatedAvailabilities = availabilityData.map(a => ({
        date: a.date,
        isAvailable: a.isAvailable,
        notes: a.notes
      }));

      await axios.post(`${API_BASE_URL}/Rooms/${selectedRoom.id}/availability`, updatedAvailabilities);
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Trạng thái phòng đã được cập nhật.',
        timer: 1500,
        showConfirmButton: false
      });
      setShowAvailabilityManager(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể cập nhật trạng thái phòng.'
      });
    }
  };

  // Tạo dãy ngày từ startDate đến endDate
  const generateDateRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--neon-blue, #00a8ff)' }}>🚪 Quản lý Phòng & Loại Phòng</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { setShowStatistics(true); fetchRoomStatistics(); }}
            style={{ padding: '8px 15px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📊 Thống kê Phòng
          </button>
          <Link to="/manager/dashboard" style={{ padding: '8px 15px', background: '#ccc', borderRadius: '5px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
            ⬅ Quay lại Dashboard
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* PHẦN 1: QUẢN LÝ LOẠI PHÒNG */}
        <div>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            {isEditingType ? "✏ Sửa Loại Phòng" : "➕ Thêm Loại Phòng Mới"}
          </h2>
          <form onSubmit={handleTypeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <input type="text" placeholder="Tên loại phòng (VD: Deluxe, Standard)" required value={typeForm.name} onChange={e => setTypeForm({ ...typeForm, name: e.target.value })} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <input type="number" placeholder="Giá tiền trên đêm (VNĐ)" required value={typeForm.price} onChange={e => setTypeForm({ ...typeForm, price: e.target.value })} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Loại giường" value={typeForm.bedType} onChange={e => setTypeForm({ ...typeForm, bedType: e.target.value })} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Hướng nhìn phòng" value={typeForm.roomView} onChange={e => setTypeForm({ ...typeForm, roomView: e.target.value })} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Tiện ích phòng" value={typeForm.amenities} onChange={e => setTypeForm({ ...typeForm, amenities: e.target.value })} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Đường dẫn ảnh phòng (URL)" value={typeForm.imageUrl} onChange={e => setTypeForm({ ...typeForm, imageUrl: e.target.value })} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={typeForm.hasBathtub} onChange={e => setTypeForm({ ...typeForm, hasBathtub: e.target.checked })} />
              Có bồn tắm nằm
            </label>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}>
                {isEditingType ? "Cập nhật" : "Lưu loại phòng"}
              </button>
            </div>
          </form>

          <h3 style={{ marginTop: '30px' }}>Danh sách Loại phòng hiện có:</h3>
          {loading ? <p>Đang tải dữ liệu...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {roomTypes.map(rt => (
                <div key={rt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: selectedRoomType?.id === rt.id ? '#e0f2fe' : '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <div onClick={() => handleSelectType(rt)} style={{ cursor: 'pointer', flex: 1 }}>
                    <strong style={{ fontSize: '16px', color: '#333' }}>{rt.name}</strong>
                    <p style={{ margin: '5px 0 0 0', color: '#00a8ff', fontWeight: 'bold' }}>{rt.price?.toLocaleString()} VNĐ/đêm</p>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => { setIsEditingType(true); setTypeForm(rt); }} style={{ padding: '5px 10px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDeleteType(rt.id)} style={{ padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PHẦN 2: QUẢN LÝ PHÒNG VẬT LÝ CỤ THỂ */}
        <div>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
            {selectedRoomType ? `🔢 Xếp phòng cho loại: ${selectedRoomType.name}` : "🔢 Quản lý số phòng vật lý"}
          </h2>

          {!selectedRoomType ? (
            <div style={{ padding: '30px', background: '#f9f9f9', borderRadius: '8px', textAlign: 'center', border: '1px dashed #ccc', color: '#666' }}>
              💡 Hãy nhấn chuột chọn một <strong>Loại phòng</strong> ở danh sách bên dưới trước để mở bảng thêm số phòng cụ thể (Ví dụ: phòng 101, 102...).
            </div>
          ) : (
            <>
              <form onSubmit={handleRoomSubmit} style={{ display: 'flex', gap: '10px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                <input type="text" placeholder="Số phòng (VD: 101, 102)" required value={roomForm.roomNumber} onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
                <button type="submit" style={{ padding: '8px 15px', background: 'var(--neon-blue, #00a8ff)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {isEditingRoom ? "Cập nhật" : "Thêm phòng"}
                </button>
                {isEditingRoom && (
                  <button
                    type="button"
                    onClick={() => { setIsEditingRoom(false); setRoomForm({ id: null, roomNumber: "", isMaintenance: false, isAvailable: true, roomTypeId: selectedRoomType.id }); }}
                    style={{ padding: '8px 15px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Hủy
                  </button>
                )}
              </form>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '10px' }}>Số Phòng</th>
                    <th style={{ padding: '10px' }}>Trạng thái</th>
                    <th style={{ padding: '10px' }}>Bảo trì</th>
                    <th style={{ padding: '10px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length > 0 ? rooms.map(room => (
                    <tr key={room.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>Phòng {room.roomNumber}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '15px', color: 'white', fontSize: '12px', background: room.isAvailable ? '#27ae60' : '#e74c3c' }}>
                          {room.isAvailable ? 'Trống' : 'Có khách'}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <input
                          type="checkbox"
                          checked={room.isMaintenance}
                          onChange={() => handleToggleMaintenance(room.id, room.isMaintenance)}
                          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                          title="Đánh dấu nếu phòng đang bảo trì"
                        />
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => { setIsEditingRoom(true); setRoomForm(room); }}
                            style={{ padding: '3px 8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleOpenAvailabilityManager(room)}
                            style={{ padding: '3px 8px', background: '#9b59b6', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            📅
                          </button>
                          <button onClick={() => deleteRoom(room.id)} style={{ padding: '3px 8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Loại phòng này chưa có phòng vật lý nào. Hãy gõ số phòng để thêm ở trên!</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* MODAL: QUẢN LÝ TRẠNG THÁI PHÒNG THEO NGÀY */}
      {showAvailabilityManager && selectedRoom && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2>📅 Quản lý Trạng thái Phòng {selectedRoom.roomNumber}</h2>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
              <div>
                <label>Từ ngày:</label>
                <input
                  type="date"
                  value={availabilityDateRange.startDate}
                  onChange={e => setAvailabilityDateRange({ ...availabilityDateRange, startDate: e.target.value })}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Đến ngày:</label>
                <input
                  type="date"
                  value={availabilityDateRange.endDate}
                  onChange={e => setAvailabilityDateRange({ ...availabilityDateRange, endDate: e.target.value })}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' }}
                />
              </div>
              <button
                onClick={() => fetchRoomAvailability(selectedRoom.id)}
                style={{ padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', alignSelf: 'flex-end' }}
              >
                Tải
              </button>
            </div>

            {/* Hiển thị lịch */}
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                {generateDateRange(availabilityDateRange.startDate, availabilityDateRange.endDate).map(date => {
                  const availability = availabilityData.find(a => a.date.split('T')[0] === date);
                  const isAvailable = availability ? availability.isAvailable : true;

                  return (
                    <div
                      key={date}
                      onClick={() => {
                        if (availability) {
                          setAvailabilityData(availabilityData.map(a =>
                            a.date.split('T')[0] === date ? { ...a, isAvailable: !a.isAvailable } : a
                          ));
                        } else {
                          setAvailabilityData([...availabilityData, { date: new Date(date).toISOString(), isAvailable: false, notes: "" }]);
                        }
                      }}
                      style={{
                        padding: '10px',
                        borderRadius: '5px',
                        background: isAvailable ? '#dcfce7' : '#fee2e2',
                        border: isAvailable ? '2px solid #16a34a' : '2px solid #dc2626',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      <div>{new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                      <div style={{ fontSize: '10px', marginTop: '5px' }}>
                        {isAvailable ? '✓ Trống' : '✗ Bận'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleUpdateAvailability}
                style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}
              >
                💾 Lưu Thay đổi
              </button>
              <button
                onClick={() => setShowAvailabilityManager(false)}
                style={{ padding: '10px 20px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: THỐNG KÊ PHÒNG */}
      {showStatistics && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px', maxWidth: '1000px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>📊 Thống kê Phòng</h2>
              <button
                onClick={() => setShowStatistics(false)}
                style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Đóng
              </button>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label>Từ ngày:</label>
                <input
                  type="date"
                  value={statsDateRange.startDate}
                  onChange={e => setStatsDateRange({ ...statsDateRange, startDate: e.target.value })}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' }}
                />
              </div>
              <div>
                <label>Đến ngày:</label>
                <input
                  type="date"
                  value={statsDateRange.endDate}
                  onChange={e => setStatsDateRange({ ...statsDateRange, endDate: e.target.value })}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' }}
                />
              </div>
              <button
                onClick={fetchRoomStatistics}
                style={{ padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', alignSelf: 'flex-end' }}
              >
                Xem Thống kê
              </button>
            </div>

            {statsLoading ? (
              <p style={{ textAlign: 'center' }}>Đang tải dữ liệu...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Phòng</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Loại</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Tổng ngày</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Trống</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Bận</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Tỉ lệ%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomStats.map((stat, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>
                          <strong>Phòng {stat.roomNumber}</strong>
                          {stat.isMaintenance && <span style={{ marginLeft: '5px', color: '#e74c3c', fontWeight: 'bold' }}>🔧</span>}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', fontSize: '12px' }}>{stat.roomTypeName}</td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{stat.totalDays}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#27ae60', fontWeight: 'bold' }}>{stat.availableDays}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>{stat.occupiedDays}</td>
                        <td style={{ padding: '10px', textAlign: 'center', background: '#fff3cd', fontWeight: 'bold' }}>{stat.occupancyRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}