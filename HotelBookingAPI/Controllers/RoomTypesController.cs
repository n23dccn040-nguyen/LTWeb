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
    }
}