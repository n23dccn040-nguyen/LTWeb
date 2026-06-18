using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    // Lớp DTO để nhận dữ liệu đặt phòng thuần túy từ Frontend
    public class CreateBookingDTO
    {
        public int? UserId { get; set; }
        public string GuestName { get; set; }
        public string GuestPhone { get; set; }
        public int RoomTypeId { get; set; }
        public int RoomQuantity { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal TotalPrice { get; set; }
    }

    // Lớp DTO cập nhật trạng thái
    public class UpdateBookingStatusDTO
    {
        public string Status { get; set; }
    }

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
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDTO dto)
        {
            var roomType = await _context.RoomTypes.FindAsync(dto.RoomTypeId);
            if (roomType == null) 
            {
                return BadRequest(new { message = "Loại phòng được chọn không tồn tại." });
            }

            var availableRooms = await _context.Rooms
                .Where(r => r.RoomTypeId == dto.RoomTypeId && r.IsAvailable == true && r.IsMaintenance == false)
                .Take(dto.RoomQuantity)
                .ToListAsync();

            if (availableRooms.Count < dto.RoomQuantity)
            {
                return BadRequest(new { message = "Xin lỗi, loại phòng này hiện tại không đủ số lượng phòng trống để đáp ứng." });
            }

            var booking = new Booking
            {
                UserId = dto.UserId,
                GuestName = dto.GuestName,
                GuestPhone = dto.GuestPhone,
                RoomTypeId = dto.RoomTypeId,
                RoomQuantity = dto.RoomQuantity,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate,
                TotalPrice = dto.TotalPrice,
                Status = "Pending"
            };

            _context.Bookings.Add(booking);

            foreach (var room in availableRooms)
            {
                room.IsAvailable = false;
            }

            await _context.SaveChangesAsync();
            return Ok(booking);
        }

        // 2. Lấy danh sách đặt phòng của MỘT khách sạn
        [HttpGet("hotel/{hotelId}")]
        public async Task<ActionResult> GetBookingsByHotel(
            int hotelId,
            [FromQuery] string? status,
            [FromQuery] string? searchName,
            [FromQuery] string sortBy = "id",
            [FromQuery] string sortOrder = "desc",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Bookings
                .Include(b => b.RoomType)
                .Where(b => b.RoomType.HotelId == hotelId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(b => b.Status == status);
            }

            if (!string.IsNullOrEmpty(searchName))
            {
                query = query.Where(b => b.GuestName.Contains(searchName));
            }

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            if (sortBy.ToLower() == "id")
            {
                query = sortOrder.ToLower() == "asc" ? query.OrderBy(b => b.Id) : query.OrderByDescending(b => b.Id);
            }

            var bookings = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                Data = bookings,
                Pagination = new { TotalItems = totalItems, TotalPages = totalPages, CurrentPage = page, PageSize = pageSize }
            });
        }

        // --- HÀM THỐNG KÊ ĐÃ ĐƯỢC BỔ SUNG VÀO ĐÂY ---
        // 3. Lấy thống kê trạng thái phòng theo khoảng thời gian
        [HttpGet("hotel/{hotelId}/statistics")]
        public async Task<IActionResult> GetHotelStatistics(int hotelId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            // Mở rộng endDate đến 23:59:59 của ngày kết thúc
            var endOfDay = endDate.Date.AddDays(1).AddTicks(-1);

            var bookings = await _context.Bookings
                .Include(b => b.RoomType)
                .Where(b => b.RoomType.HotelId == hotelId 
                            && b.CheckInDate >= startDate.Date 
                            && b.CheckInDate <= endOfDay) // Chỉ so sánh ngày Check-in
                .ToListAsync();

            var stats = new
            {
                TotalBookings = bookings.Count,
                TotalRevenue = bookings.Where(b => b.Status == "Confirmed" || b.Status == "CheckedIn").Sum(b => b.TotalPrice),
                CancelledBookings = bookings.Count(b => b.Status == "Cancelled"),
                PendingBookings = bookings.Count(b => b.Status == "Pending")
            };

            return Ok(stats);
        }

        // 4. Lấy lịch sử đặt phòng của khách hàng dựa vào UserId
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetUserBookings(int userId)
        {
            return await _context.Bookings
                .Include(b => b.RoomType)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.Id)
                .ToListAsync();
        }

        // 5. Cập nhật trạng thái đơn đặt phòng
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, [FromBody] UpdateBookingStatusDTO request)
        {
            var existingBooking = await _context.Bookings.FindAsync(id);
            if (existingBooking == null) return NotFound("Không tìm thấy đơn đặt phòng.");

            existingBooking.Status = request.Status;

            if (request.Status == "Cancelled")
            {
                var roomToFree = await _context.Rooms
                    .FirstOrDefaultAsync(r => r.RoomTypeId == existingBooking.RoomTypeId && r.IsAvailable == false);
                if (roomToFree != null) roomToFree.IsAvailable = true;
            }

            await _context.SaveChangesAsync();
            return Ok(existingBooking);
        }

        // 6. Xóa hẳn đơn đặt phòng
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return NotFound("Không tìm thấy đơn đặt phòng.");

            if (booking.Status != "Cancelled" && booking.Status != "CheckedOut")
            {
                var roomToFree = await _context.Rooms
                    .FirstOrDefaultAsync(r => r.RoomTypeId == booking.RoomTypeId && r.IsAvailable == false);
                if (roomToFree != null) roomToFree.IsAvailable = true;
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa thành công đơn đặt phòng." });
        }
    }
}