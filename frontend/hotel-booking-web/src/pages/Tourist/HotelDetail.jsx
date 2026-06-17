import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingModal from "../../components/BookingModal";

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    guestName: "",
    guestPhone: "",
    roomQuantity: 1,
    checkInDate: "",
    checkOutDate: "",
  });

  const API_BASE_URL = "http://localhost:5154/api";

  useEffect(() => {
    const fetchHotelDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Hotels/${id}`);
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelDetail();
  }, [id]);

  useEffect(() => {
    // Pre-fill user data if logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setBookingForm(prev => ({
        ...prev,
        guestName: user.fullName || "",
        guestPhone: user.phoneNumber || "" // assuming phone might be there, else empty
      }));
    }
  }, []);

  const openBookingModal = (roomType) => {
    setSelectedRoom(roomType);
    setIsModalOpen(true);
  };
  
  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Kiểm tra ngày tháng
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      alert("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }

    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    
    // Tính số đêm lưu trú
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const numberOfNights = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (numberOfNights <= 0) {
      alert("Ngày trả phòng phải sau ngày nhận phòng!");
      return;
    }

    // 2. Lấy ID user nếu đã đăng nhập (Nếu là khách vãng lai đặt nhanh thì userId = null)
    let userId = null;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        userId = JSON.parse(storedUser).id;
    }

    try {
      // 3. Tính chuẩn Tổng Tiền = Giá 1 đêm * Số lượng phòng * Số đêm
      const finalTotalPrice = selectedRoom.price * Number(bookingForm.roomQuantity) * numberOfNights;

      const bookingData = {
        userId: userId,
        guestName: bookingForm.guestName,
        guestPhone: bookingForm.guestPhone,
        roomTypeId: selectedRoom.id,
        roomQuantity: Number(bookingForm.roomQuantity),
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        totalPrice: finalTotalPrice, 
        status: "Pending" // Mặc định là chờ duyệt
      };
      
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // 4. Gọi API Đặt phòng
      await axios.post(`${API_BASE_URL}/Bookings`, bookingData, config);
      
      alert(`🎉 Đặt phòng thành công!\n- Số đêm: ${numberOfNights}\n- Tổng tiền: ${finalTotalPrice.toLocaleString()} VNĐ`);
      setIsModalOpen(false); // Đóng modal
      
    } catch (error) {
      console.error(error);
      alert("Lỗi khi đặt phòng! Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Đang tải dữ liệu khách sạn...</div>;
  }

  if (!hotel) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Không tìm thấy khách sạn.</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '10px' }}>{hotel.name}</h1>
      <p style={{ color: '#555', marginBottom: '20px' }}>📍 {hotel.city} - {hotel.address}</p>
      
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h3>Mô tả khách sạn</h3>
        <p style={{ lineHeight: '1.6', marginTop: '10px' }}>{hotel.description || "Chưa có mô tả chi tiết."}</p>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Các loại phòng hiện có</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {hotel.roomTypes && hotel.roomTypes.length > 0 ? (
          hotel.roomTypes.map((rt) => (
            <div key={rt.id} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <div style={{ height: '200px', background: '#ccc' }}>
                {rt.imageUrl ? (
                  <img src={rt.imageUrl} alt={rt.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#666' }}>No Image</div>
                )}
              </div>
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{rt.name}</h3>
                <p style={{ margin: '5px 0' }}><strong>Loại giường:</strong> {rt.bedType || 'N/A'}</p>
                <p style={{ margin: '5px 0' }}><strong>Hướng nhìn:</strong> {rt.roomView || 'N/A'}</p>
                <p style={{ margin: '5px 0' }}><strong>Tiện ích:</strong> {rt.amenities || 'N/A'}</p>
                <p style={{ margin: '5px 0', color: 'var(--neon-blue)', fontWeight: 'bold', fontSize: '18px' }}>
                  {rt.price ? rt.price.toLocaleString() : 0} VNĐ/đêm
                </p>
                <button 
                  onClick={() => openBookingModal(rt)}
                  style={{ width: '100%', padding: '10px', background: 'var(--neon-blue)', color: 'white', border: 'none', borderRadius: '5px', marginTop: '15px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Đặt phòng ngay
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Khách sạn này chưa có thông tin loại phòng.</p>
        )}
      </div>

      {isModalOpen && (
        <BookingModal
          selectedRoom={selectedRoom}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
          onSubmit={handleBookingSubmit}
          onClose={closeBookingModal}
        />
      )}
    </div>
  );
}
