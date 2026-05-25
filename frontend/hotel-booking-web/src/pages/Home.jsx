import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  // Biến state lưu trữ danh sách khách sạn lấy từ Backend
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API ngay khi component được render lần đầu tiên
  useEffect(() => {
    // Lưu ý: Thay đổi cổng 5154 nếu máy của bạn chạy cổng khác!
    axios.get('http://localhost:5154/api/Hotels')
      .then(response => {
        setHotels(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi trong quá trình lấy dữ liệu từ API: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Đang tải danh sách khách sạn...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c3e50' }}>🏨 Danh sách Khách sạn Đối tác</h1>
      <p style={{ color: '#7f8c8d' }}>Dữ liệu thời gian thực được đồng bộ từ SQL Server thông qua ASP.NET Core API</p>
      
      {hotels.length === 0 ? (
        <p>Hiện tại chưa có khách sạn nào trong hệ thống.</p>
      ) : (
        <div style={{ display: 'block', marginTop: '20px' }}>
          {hotels.map(hotel => (
            <div key={hotel.id} style={{
              marginBottom: '15px', 
              border: '1px solid #e2e8f0', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>{hotel.name}</h3>
              <p style={{ margin: '5px 0' }}><strong>📍 Thành phố:</strong> {hotel.city}</p>
              <p style={{ margin: '5px 0' }}><strong>🗺️ Địa chỉ cụ thể:</strong> {hotel.address}</p>
              {hotel.description && <p style={{ margin: '5px 0', color: '#555', fontStyle: 'italic' }}>"{hotel.description}"</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
