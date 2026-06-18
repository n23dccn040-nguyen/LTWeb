using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách các phòng thuộc một LOẠI PHÒNG cụ thể
        [HttpGet("roomtype/{roomTypeId}")]
        public async Task<ActionResult<IEnumerable<Room>>> GetRoomsByRoomType(int roomTypeId)
        {
            return await _context.Rooms
                .Where(r => r.RoomTypeId == roomTypeId)
                .ToListAsync();
        }

        // 2. Thêm một Phòng mới
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(Room room)
        {
            var roomTypeExists = await _context.RoomTypes.AnyAsync(rt => rt.Id == room.RoomTypeId);
            if (!roomTypeExists)
            {
                return BadRequest("Không tìm thấy Loại phòng với Id này.");
            }

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoomsByRoomType", new { roomTypeId = room.RoomTypeId }, room);
        }

        // 3. Cập nhật trạng thái phòng: Đang rảnh (true) <-> Có khách (false)
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateRoomStatus(int id, [FromBody] bool isAvailable)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound("Không tìm thấy phòng này trong hệ thống.");
            }

            room.IsAvailable = isAvailable;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật trạng thái phòng thành công!" });
        }

        // 4. Cập nhật TOÀN BỘ thông tin phòng 
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, Room roomRequest)
        {
            var existingRoom = await _context.Rooms.FindAsync(id);
            if (existingRoom == null)
            {
                return NotFound("Không tìm thấy phòng này.");
            }

            var roomTypeExists = await _context.RoomTypes.AnyAsync(rt => rt.Id == roomRequest.RoomTypeId);
            if (!roomTypeExists)
            {
                return BadRequest("Không tìm thấy Loại phòng với Id này.");
            }

            existingRoom.RoomNumber = roomRequest.RoomNumber;
            existingRoom.IsMaintenance = roomRequest.IsMaintenance;
            existingRoom.IsAvailable = roomRequest.IsAvailable;
            existingRoom.RoomTypeId = roomRequest.RoomTypeId;

            await _context.SaveChangesAsync();
            return Ok(existingRoom);
        }

        // 5. Xóa phòng 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound("Không tìm thấy phòng này để xóa.");
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Đã xóa thành công phòng số: {room.RoomNumber}" });
        }

        // 6. Cập nhật trạng thái bảo trì phòng
        [HttpPut("{id}/maintenance")]
        public async Task<IActionResult> UpdateRoomMaintenance(int id, [FromBody] bool isMaintenance)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound("Không tìm thấy phòng này.");
            }

            room.IsMaintenance = isMaintenance;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Trạng thái bảo trì phòng {room.RoomNumber} đã được cập nhật.", room });
        }

        // 7. Cập nhật trạng thái phòng theo ngày (RoomAvailability)
        [HttpPost("{roomId}/availability")]
        public async Task<IActionResult> SetRoomAvailability(int roomId, [FromBody] List<RoomAvailabilityDTO> availabilities)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
            {
                return NotFound("Không tìm thấy phòng này.");
            }

            // Xóa dữ liệu cũ cho những ngày được cập nhật
            var datesToUpdate = availabilities.Select(a => a.Date.Date).ToList();
            var oldAvailabilities = await _context.RoomAvailabilities
                .Where(ra => ra.RoomId == roomId && datesToUpdate.Contains(ra.Date.Date))
                .ToListAsync();

            _context.RoomAvailabilities.RemoveRange(oldAvailabilities);

            // Thêm dữ liệu mới
            foreach (var availability in availabilities)
            {
                _context.RoomAvailabilities.Add(new RoomAvailability
                {
                    RoomId = roomId,
                    Date = availability.Date.Date,
                    IsAvailable = availability.IsAvailable,
                    Notes = availability.Notes
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật trạng thái phòng thành công!" });
        }

        // 8. Lấy thông tin trạng thái phòng trong khoảng thời gian
        [HttpGet("{roomId}/availability")]
        public async Task<ActionResult> GetRoomAvailability(int roomId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
            {
                return NotFound("Không tìm thấy phòng này.");
            }

            var availabilities = await _context.RoomAvailabilities
                .Where(ra => ra.RoomId == roomId && ra.Date >= startDate.Date && ra.Date <= endDate.Date)
                .OrderBy(ra => ra.Date)
                .ToListAsync();

            return Ok(new { roomId, roomNumber = room.RoomNumber, availabilities });
        }

        // 9. Thống kê phòng theo khoảng thời gian
        [HttpGet("hotel/{hotelId}/statistics")]
        public async Task<ActionResult> GetRoomStatistics(int hotelId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            // Lấy tất cả phòng của khách sạn
            var rooms = await _context.Rooms
                .Include(r => r.RoomType)
                .Where(r => r.RoomType.HotelId == hotelId)
                .ToListAsync();

            if (rooms.Count == 0)
            {
                return NotFound("Không tìm thấy phòng nào cho khách sạn này.");
            }

            var stats = new List<object>();

            foreach (var room in rooms)
            {
                var availabilities = await _context.RoomAvailabilities
                    .Where(ra => ra.RoomId == room.Id && ra.Date >= startDate.Date && ra.Date <= endDate.Date)
                    .OrderBy(ra => ra.Date)
                    .ToListAsync();

                // Nếu không có dữ liệu, tính toán từ Booking
                if (availabilities.Count == 0)
                {
                    availabilities = GenerateAvailabilityFromBookings(room.Id, startDate, endDate);
                }

                var availableDays = availabilities.Count(a => a.IsAvailable);
                var occupiedDays = availabilities.Count(a => !a.IsAvailable);
                var occupancyRate = availabilities.Count > 0 ? Math.Round((double)occupiedDays / availabilities.Count * 100, 2) : 0;

                stats.Add(new
                {
                    roomId = room.Id,
                    roomNumber = room.RoomNumber,
                    roomTypeName = room.RoomType.Name,
                    isMaintenance = room.IsMaintenance,
                    totalDays = availabilities.Count,
                    availableDays = availableDays,
                    occupiedDays = occupiedDays,
                    occupancyRate = occupancyRate + "%",
                    availabilities = availabilities.Take(31).ToList() // Giới hạn 31 ngày
                });
            }

            return Ok(new
            {
                hotelId,
                startDate = startDate.Date,
                endDate = endDate.Date,
                totalRooms = rooms.Count,
                roomStatistics = stats
            });
        }

        // Helper: Tạo danh sách availability từ Booking nếu không có dữ liệu RoomAvailability
        private List<RoomAvailability> GenerateAvailabilityFromBookings(int roomId, DateTime startDate, DateTime endDate)
        {
            var availabilities = new List<RoomAvailability>();
            var currentDate = startDate.Date;
            var room = _context.Rooms.Find(roomId);

            while (currentDate <= endDate.Date)
            {
                // Kiểm tra xem có booking nào chứa ngày này không
                var hasBooking = _context.Bookings
                    .Include(b => b.RoomType)
                    .Where(b => b.RoomType.Id == room.RoomTypeId &&
                                (b.Status == "Confirmed" || b.Status == "CheckedIn") &&
                                b.CheckInDate.Date <= currentDate &&
                                b.CheckOutDate.Date > currentDate)
                    .Any();

                availabilities.Add(new RoomAvailability
                {
                    RoomId = roomId,
                    Date = currentDate,
                    IsAvailable = !hasBooking,
                    Notes = hasBooking ? "Có đặt phòng" : "Trống"
                });

                currentDate = currentDate.AddDays(1);
            }

            return availabilities;
        }
    }
}

public class RoomAvailabilityDTO
{
    public DateTime Date { get; set; }
    public bool IsAvailable { get; set; }
    public string? Notes { get; set; }
}