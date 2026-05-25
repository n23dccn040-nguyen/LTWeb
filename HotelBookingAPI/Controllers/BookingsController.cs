using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Thực hiện Đặt phòng
        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
        {
            // Kiểm tra xem Loại phòng có tồn tại không
            var roomType = await _context.RoomTypes.FindAsync(booking.RoomTypeId);
            if (roomType == null) return BadRequest("Loại phòng không tồn tại.");

            // Tìm một phòng bất kỳ thuộc loại này mà đang trống (IsAvailable = true)
            var availableRoom = await _context.Rooms
                .FirstOrDefaultAsync(r => r.RoomTypeId == booking.RoomTypeId && r.IsAvailable == true);

            if (availableRoom == null)
            {
                return BadRequest("Xin lỗi, loại phòng này hiện không còn phòng trống.");
            }

            // --- GIAO DỊCH ĐẶT PHÒNG ---
            
            // 1. Lưu thông tin đặt phòng
            _context.Bookings.Add(booking);
            
            // 2. Tự động đổi trạng thái phòng thành "Đang có khách" (false)
            availableRoom.IsAvailable = false;
            
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateBooking), new { id = booking.Id }, booking);
        }

        // 2. Lấy danh sách tất cả đơn đặt phòng
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            return await _context.Bookings.ToListAsync();
        }
    }
}