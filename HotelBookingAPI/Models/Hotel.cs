using System.ComponentModel.DataAnnotations;

namespace HotelBookingAPI.Models
{
    public class Hotel
    {
        [Key]
        public int Id { get; set; }

        [Required, StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required, StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        // Thêm dấu ? vào đây để báo hiệu rằng: 
        // "Tôi không bắt buộc phải có danh sách RoomTypes ngay từ đầu"
        public ICollection<RoomType>? RoomTypes { get; set; }
    }
}