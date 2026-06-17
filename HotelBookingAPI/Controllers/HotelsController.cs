using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HotelsController(AppDbContext context)
        {
            _context = context;
        }

        // API 1: Lấy toàn bộ danh sách khách sạn
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotels()
        {
            return await _context.Hotels.ToListAsync();
        }

        // API 1.5: Lấy chi tiết 1 khách sạn theo ID (Quan trọng: Dành cho trang HotelDetail.jsx)
        [HttpGet("{id}")]
        public async Task<ActionResult<Hotel>> GetHotelById(int id)
        {
            var hotel = await _context.Hotels
                .Include(h => h.RoomTypes!) // Tải kèm danh sách loại phòng để hiển thị
                .FirstOrDefaultAsync(h => h.Id == id);

            if (hotel == null)
            {
                return NotFound("Không tìm thấy khách sạn.");
            }

            return Ok(hotel);
        }

        // Lấy danh sách khách sạn theo ManagerId
        [HttpGet("manager/{managerId}")]
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotelsByManager(int managerId)
        {
            var hotels = await _context.Hotels
                .Where(h => h.ManagerId == managerId)
                .ToListAsync();
            return Ok(hotels);
        }

        // API 2: Tìm kiếm nâng cao dành cho Khách du lịch
        [HttpGet("search")]
        public async Task<IActionResult> SearchHotels(
            [FromQuery] string? city,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? roomType,
            [FromQuery] DateTime? checkIn,
            [FromQuery] DateTime? checkOut,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6,
            [FromQuery] string sortBy = "name",
            [FromQuery] string sortOrder = "asc")
        {
            // Tải trước dữ liệu liên quan
            var query = _context.Hotels
                .Include(h => h.RoomTypes!)
                    .ThenInclude(rt => rt.Rooms)
                .Include(h => h.RoomTypes!)
                    .ThenInclude(rt => rt.Bookings)
                .AsQueryable();

            // 1. LỌC THEO THÀNH PHỐ
            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(h => h.City.Contains(city));
            }

            // 2. LỌC NÂNG CAO
            if (minPrice.HasValue || maxPrice.HasValue || !string.IsNullOrEmpty(roomType) || (checkIn.HasValue && checkOut.HasValue))
            {
                query = query.Where(h => h.RoomTypes!.Any(rt =>
                    (!minPrice.HasValue || rt.Price >= minPrice.Value) &&
                    (!maxPrice.HasValue || rt.Price <= maxPrice.Value) &&
                    (string.IsNullOrEmpty(roomType) || rt.Name.Contains(roomType)) &&
                    (!checkIn.HasValue || !checkOut.HasValue ||
                        (rt.Rooms!.Count(r => !r.IsMaintenance) -
                         rt.Bookings!.Where(b => b.Status != "Cancelled" && b.CheckInDate < checkOut.Value && b.CheckOutDate > checkIn.Value)
                                     .Sum(b => b.RoomQuantity) > 0)
                    )
                ));
            }

            // 3. SẮP XẾP
            if (sortBy.ToLower() == "name")
            {
                query = sortOrder.ToLower() == "desc" ? query.OrderByDescending(h => h.Name) : query.OrderBy(h => h.Name);
            }
            else if (sortBy.ToLower() == "city")
            {
                query = sortOrder.ToLower() == "desc" ? query.OrderByDescending(h => h.City) : query.OrderBy(h => h.City);
            }

            // 4. PHÂN TRANG
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var hotels = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(h => new {
                    h.Id,
                    h.Name,
                    h.City,
                    h.Address,
                    h.Description,
                    h.ManagerId,
                    RoomTypes = h.RoomTypes!.Select(rt => new {
                        rt.Id,
                        rt.Name,
                        rt.Price,
                        rt.BedType,
                        rt.RoomView,
                        rt.HasBathtub,
                        rt.Amenities,
                        rt.ImageUrl
                    })
                })
                .ToListAsync();

            return Ok(new {
                Data = hotels,
                Pagination = new {
                    TotalItems = totalItems,
                    TotalPages = totalPages,
                    CurrentPage = page,
                    PageSize = pageSize
                }
            });
        }

        // API 3: Thêm một khách sạn mới
        [HttpPost]
        public async Task<ActionResult<Hotel>> PostHotel(Hotel hotel)
        {
            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();
            // Đã sửa lỗi 500: Gọi trỏ đúng vào hàm GetHotelById
            return CreatedAtAction(nameof(GetHotelById), new { id = hotel.Id }, hotel);
        }

        // API 4: Cập nhật thông tin khách sạn (Đã gộp chung hàm tránh lỗi xung đột)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHotel(int id, Hotel hotelRequest)
        {
            var existingHotel = await _context.Hotels.FindAsync(id);
            if (existingHotel == null)
            {
                return NotFound("Không tìm thấy Khách sạn với Id này để cập nhật.");
            }

            // Ghi đè dữ liệu mới
            existingHotel.Name = hotelRequest.Name;
            existingHotel.City = hotelRequest.City;
            existingHotel.Address = hotelRequest.Address;
            existingHotel.Description = hotelRequest.Description;
            existingHotel.ManagerId = hotelRequest.ManagerId;

            await _context.SaveChangesAsync();

            return Ok(existingHotel); 
        }

        // API 5: Xóa khách sạn
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            var hotel = await _context.Hotels.FindAsync(id);
            if (hotel == null)
            {
                return NotFound("Không tìm thấy Khách sạn với Id này để xóa.");
            }

            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Đã xóa thành công khách sạn: {hotel.Name}" });
        }
    }
}