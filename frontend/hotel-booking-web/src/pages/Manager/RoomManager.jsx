import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

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
        alert("Cập nhật Loại phòng thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/RoomTypes`, payload);
        alert("Thêm Loại phòng mới thành công!");
      }

      setTypeForm({ id: null, name: "", price: "", bedType: "", roomView: "", hasBathtub: false, amenities: "", imageUrl: "", hotelId: Number(hotelId) });
      setIsEditingType(false);
      fetchRoomTypes();
      setSelectedRoomType(null);
      setRooms([]);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi lưu Loại phòng!");
    }
  };

  const handleDeleteType = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại phòng này không?")) {
      try {
        await axios.delete(`${API_BASE_URL}/RoomTypes/${id}`);
        alert("Xóa loại phòng thành công!");
        fetchRoomTypes();
        setSelectedRoomType(null);
        setRooms([]);
      } catch (error) {
        alert("Không thể xóa loại phòng này vì đang có phòng vật lý thuộc loại này.");
      }
    }
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
        alert("Cập nhật phòng thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/Rooms`, payload);
        alert("Thêm phòng vật lý thành công!");
      }

      setRoomForm({ id: null, roomNumber: "", isMaintenance: false, isAvailable: true, roomTypeId: selectedRoomType.id });
      setIsEditingRoom(false);
      fetchRooms(selectedRoomType.id);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu thông tin phòng vật lý!");
    }
  };

  const deleteRoom = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phòng này không?")) {
      try {
        await axios.delete(`${API_BASE_URL}/Rooms/${id}`);
        alert("Xóa phòng thành công!");
        fetchRooms(selectedRoomType.id);
      } catch (error) {
        alert("Lỗi khi xóa phòng.");
      }
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--neon-blue, #00a8ff)' }}>🚪 Quản lý Phòng & Loại Phòng</h1>
        <Link to="/manager/dashboard" style={{ padding: '8px 15px', background: '#ccc', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>
          ⬅ Quay lại Dashboard
        </Link>
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
                  Thêm phòng
                </button>
              </form>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '10px' }}>Số Phòng</th>
                    <th style={{ padding: '10px' }}>Trạng thái</th>
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
                        <button onClick={() => deleteRoom(room.id)} style={{ padding: '3px 8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>Xóa</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Loại phòng này chưa có phòng vật lý nào. Hãy gõ số phòng để thêm ở trên!</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}