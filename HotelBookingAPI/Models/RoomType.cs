using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBookingAPI.Models
{
    public class RoomType
    {
        [Key]
        public int Id { get; set; }

        public int HotelId { get; set; }
        [ForeignKey("HotelId")]
        public Hotel? Hotel { get; set; } // Thêm dấu ? ở đây

        [Required, StringLength(100)]
        public string Name { get; set; } 

        [Required]
        public decimal Price { get; set; } 

        // --- Các thông tin chi tiết theo yêu cầu (b) ---
        public string BedType { get; set; } 
        public string RoomView { get; set; } 
        public bool HasBathtub { get; set; } 
        public string Amenities { get; set; } 
        public string ImageUrl { get; set; } 

        // Thêm dấu ? ở 2 dòng dưới đây
        public ICollection<Room>? Rooms { get; set; }
        public ICollection<Booking>? Bookings { get; set; }
    }
}