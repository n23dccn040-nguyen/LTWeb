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
    }
}