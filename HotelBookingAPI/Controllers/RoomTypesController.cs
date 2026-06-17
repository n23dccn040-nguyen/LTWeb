using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    // Lớp DTO nhận dữ liệu thuần từ Frontend gửi sang để tránh lỗi xác thực thực thể liên kết bị null
    public class RoomTypeDTO
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string BedType { get; set; }
        public string RoomView { get; set; }
        public bool HasBathtub { get; set; }
        public string Amenities { get; set; }
        public string ImageUrl { get; set; }
        public int HotelId { get; set; }
    }

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
        [HttpGet("hotel/{hotelId}")]
        public async Task<ActionResult<IEnumerable<RoomType>>> GetRoomTypesByHotel(int hotelId)
        {
            return await _context.RoomTypes
                .Where(rt => rt.HotelId == hotelId)
                .ToListAsync();
        }

        // 2. Thêm một Loại phòng mới (SỬA LỖI ĐỂ NHẬN DTO)
        [HttpPost]
        public async Task<ActionResult<RoomType>> PostRoomType([FromBody] RoomTypeDTO dto)
        {
            var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == dto.HotelId);
            if (!hotelExists)
            {
                return BadRequest("Không tìm thấy Khách sạn với Id này.");
            }

            var roomType = new RoomType
            {
                HotelId = dto.HotelId,
                Name = dto.Name,
                Price = dto.Price,
                BedType = dto.BedType,
                RoomView = dto.RoomView,
                HasBathtub = dto.HasBathtub,
                Amenities = dto.Amenities,
                ImageUrl = dto.ImageUrl ?? ""
            };

            _context.RoomTypes.Add(roomType);
            await _context.SaveChangesAsync();

            return Ok(roomType);
        }

        // 3. Cập nhật Loại phòng
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoomType(int id, [FromBody] RoomTypeDTO dto)
        {
            var existingRoomType = await _context.RoomTypes.FindAsync(id);
            if (existingRoomType == null) return NotFound("Không tìm thấy Loại phòng.");

            var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == dto.HotelId);
            if (!hotelExists) return BadRequest("Không tìm thấy Khách sạn với Id này.");

            existingRoomType.Name = dto.Name;
            existingRoomType.Price = dto.Price;
            existingRoomType.BedType = dto.BedType;
            existingRoomType.RoomView = dto.RoomView;
            existingRoomType.HasBathtub = dto.HasBathtub;
            existingRoomType.Amenities = dto.Amenities;
            existingRoomType.ImageUrl = dto.ImageUrl ?? "";
            existingRoomType.HotelId = dto.HotelId;

            await _context.SaveChangesAsync();
            return Ok(existingRoomType);
        }

        // 4. Xóa Loại phòng
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
            return Ok(new { message = "Đã xóa thành công loại phòng." });
        }
    }
}