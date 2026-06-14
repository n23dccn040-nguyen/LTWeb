using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomTypesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomTypesController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách loại phòng của MỘT Khách sạn cụ thể
        // GET: api/RoomTypes/hotel/1
        [HttpGet("hotel/{hotelId}")]
        public async Task<ActionResult<IEnumerable<RoomType>>> GetRoomTypesByHotel(int hotelId)
        {
            return await _context.RoomTypes
                .Where(rt => rt.HotelId == hotelId)
                .ToListAsync();
        }

        // 2. Thêm một Loại phòng mới
        // POST: api/RoomTypes
        [HttpPost]
        public async Task<ActionResult<RoomType>> PostRoomType(RoomType roomType)
        {
            // Kiểm tra xem khách sạn có tồn tại không
            var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == roomType.HotelId);
            if (!hotelExists)
            {
                return BadRequest("Không tìm thấy Khách sạn với Id này.");
            }

            _context.RoomTypes.Add(roomType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoomTypesByHotel", new { hotelId = roomType.HotelId }, roomType);
        }

        // 3. Cập nhật Loại phòng (MỚI) - Để Admin sửa giá, sửa tên, tiện ích...
        // PUT: api/RoomTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomType(int id, RoomType roomTypeRequest)
        {
            var existingRoomType = await _context.RoomTypes.FindAsync(id);
            if (existingRoomType == null)
            {
                return NotFound("Không tìm thấy Loại phòng này để cập nhật.");
            }

            // Kiểm tra xem Khách sạn (nếu có bị đổi nhầm) có tồn tại không
            var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == roomTypeRequest.HotelId);
            if (!hotelExists)
            {
                return BadRequest("Không tìm thấy Khách sạn với Id này.");
            }

            // Ghi đè các thông tin mới
            existingRoomType.Name = roomTypeRequest.Name;
            existingRoomType.Price = roomTypeRequest.Price;
            existingRoomType.BedType = roomTypeRequest.BedType;
            existingRoomType.RoomView = roomTypeRequest.RoomView;
            existingRoomType.HasBathtub = roomTypeRequest.HasBathtub;
            existingRoomType.Amenities = roomTypeRequest.Amenities;
            existingRoomType.ImageUrl = roomTypeRequest.ImageUrl;
            existingRoomType.HotelId = roomTypeRequest.HotelId;

            await _context.SaveChangesAsync();
            return Ok(existingRoomType);
        }

        // 4. Xóa Loại phòng (MỚI)
        // DELETE: api/RoomTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomType(int id)
        {
            var roomType = await _context.RoomTypes.FindAsync(id);
            if (roomType == null)
            {
                return NotFound("Không tìm thấy Loại phòng này để xóa.");
            }

            _context.RoomTypes.Remove(roomType);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Đã xóa thành công loại phòng: {roomType.Name}" });
        }
    }
}