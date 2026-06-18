using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBookingAPI.Models
{
    public class RoomAvailability
    {
        [Key]
        public int Id { get; set; }

        public int RoomId { get; set; }
        [ForeignKey("RoomId")]
        public Room? Room { get; set; }

        [Required]
        public DateTime Date { get; set; } // Ngày

        public bool IsAvailable { get; set; } = true; // true = trống, false = bận

        public string? Notes { get; set; } // Ghi chú: "Đang bảo trì", "Khách check-in", etc.

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
