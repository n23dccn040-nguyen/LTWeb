export default function HotelCard({ hotel, onOpenModal }) {
  return (
    <div
      className="hotel-card"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(149, 157, 165, 0.2)", // Đổ bóng 3D
        border: "none",
        marginBottom: "20px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <h2
        className="hotel-name"
        style={{ color: "#2c3e50", marginBottom: "12px" }}
      >
        🏨 {hotel.name}
      </h2>
      <p
        className="hotel-description"
        style={{ color: "#7f8c8d", lineHeight: "1.6" }}
      >
        {hotel.description}
      </p>

      <div
        className="room-grid"
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {hotel.roomTypes?.map((rt) => (
          <div
            key={rt.id}
            className="room-card"
            style={{
              background: "linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)", // Nền xanh nhạt mát mẻ
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid #e1eefb",
              flex: "1",
              minWidth: "200px",
              textAlign: "center",
            }}
          >
            <h5
              className="room-title"
              style={{
                color: "#2980b9",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              {rt.name}
            </h5>
            <p
              className="room-price"
              style={{
                color: "#e74c3c",
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "15px",
              }}
            >
              💵 {rt.price.toLocaleString()} VNĐ
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Ngăn lỗi click đúp khi vừa chuyển trang vừa mở modal
                onOpenModal(rt);
              }}
              className="btn-book"
              style={{
                backgroundColor: "#00a8ff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0097e6")} // Rê chuột vào đổi màu tối hơn
              onMouseOut={(e) => (e.target.style.backgroundColor = "#00a8ff")} // Nhả chuột ra về màu cũ
            >
              Đặt phòng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
