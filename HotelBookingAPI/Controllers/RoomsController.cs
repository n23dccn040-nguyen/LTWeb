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
        // GET: api/Rooms/roomtype/1
        [HttpGet("roomtype/{roomTypeId}")]
        public async Task<ActionResult<IEnumerable<Room>>> GetRoomsByRoomType(int roomTypeId)
        {
            return await _context.Rooms
                .Where(r => r.RoomTypeId == roomTypeId)
                .ToListAsync();
        }

        // 2. Thêm một Phòng mới (Ví dụ: Căn hộ A, Phòng 101...)
        // POST: api/Rooms
        [HttpPost]
        public async Task<ActionResult<Room>> PostRoom(Room room)
        {
            // Kiểm tra xem Loại phòng (RoomType) có tồn tại không
            var roomTypeExists = await _context.RoomTypes.AnyAsync(rt => rt.Id == room.RoomTypeId);
            if (!roomTypeExists)
            {
                return BadRequest("Không tìm thấy Loại phòng với Id này.");
            }

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoomsByRoomType", new { roomTypeId = room.RoomTypeId }, room);
        }

        // 3. (Hàm quan trọng) Cập nhật trạng thái phòng: Đang rảnh (true) <-> Có khách (false)
        // PUT: api/Rooms/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateRoomStatus(int id, [FromBody] bool isAvailable)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound("Không tìm thấy phòng này trong hệ thống.");
            }

            room.IsAvailable = isAvailable; // Đổi trạng thái
            await _context.SaveChangesAsync(); // Lưu vào SQL

            return Ok(new { message = "Cập nhật trạng thái phòng thành công!" });
        }
    }
}