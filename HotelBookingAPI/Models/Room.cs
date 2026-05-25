using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBookingAPI.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }

        public int RoomTypeId { get; set; }
        [ForeignKey("RoomTypeId")]
        public RoomType? RoomType { get; set; } // Đã thêm dấu ? ở đây

        [Required, StringLength(50)]
        public string RoomNumber { get; set; } // VD: 101, 102, 201

        public bool IsMaintenance { get; set; } = false; // True nếu phòng đang sửa chữa, không cho thuê
        
        // Lưu ý: Trạng thái trống/bận theo ngày sẽ được tính toán dựa trên bảng Booking, 
        // không lưu cứng ở đây vì trạng thái thay đổi liên tục theo thời gian.
        public bool IsAvailable { get; set; } = true;
    }
}