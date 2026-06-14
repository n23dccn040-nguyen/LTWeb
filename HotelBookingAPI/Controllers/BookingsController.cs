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

        // 1. Thực hiện Đặt phòng (Giữ nguyên logic chuẩn của bạn)
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

        // 2. Lấy danh sách tất cả đơn đặt phòng (Giữ nguyên của bạn)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            return await _context.Bookings.ToListAsync();
        }

        // 3. API Cập nhật đơn đặt phòng (MỚI) - Xử lý đổi lịch hoặc Hủy đơn đổi trạng thái phòng
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, Booking bookingRequest)
        {
            var existingBooking = await _context.Bookings.FindAsync(id);
            if (existingBooking == null)
            {
                return NotFound("Không tìm thấy đơn đặt phòng này để cập nhật.");
            }

            // Nếu trạng thái chuyển sang "Cancelled" (Hủy), tự động giải phóng 1 phòng thuộc loại này
            if (bookingRequest.Status == "Cancelled" && existingBooking.Status != "Cancelled")
            {
                var roomToFree = await _context.Rooms
                    .FirstOrDefaultAsync(r => r.RoomTypeId == existingBooking.RoomTypeId && r.IsAvailable == false);
                
                if (roomToFree != null)
                {
                    roomToFree.IsAvailable = true; // Trả phòng về trạng thái trống
                }
            }

            // Cập nhật thông tin mới
            existingBooking.CheckInDate = bookingRequest.CheckInDate;
            existingBooking.CheckOutDate = bookingRequest.CheckOutDate;
            existingBooking.Status = bookingRequest.Status; 

            await _context.SaveChangesAsync();
            return Ok(existingBooking);
        }

        // 4. API Xóa hẳn đơn đặt phòng (MỚI) - Giải phóng phòng lập tức
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound("Không tìm thấy đơn đặt phòng này để xóa.");
            }

            // Trước khi xóa đơn, kiểm tra xem phòng của loại này có đang bị giữ không để giải phóng
            if (booking.Status != "Cancelled")
            {
                var roomToFree = await _context.Rooms
                    .FirstOrDefaultAsync(r => r.RoomTypeId == booking.RoomTypeId && r.IsAvailable == false);
                
                if (roomToFree != null)
                {
                    roomToFree.IsAvailable = true; // Cho phép phòng trống trở lại
                }
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa thành công đơn đặt phòng và giải phóng phòng trống." });
        }
    }
}