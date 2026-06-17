using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelBookingAPI.Data;
using HotelBookingAPI.Models;

namespace HotelBookingAPI.Controllers
{
    // Class DTO để hứng dữ liệu rút gọn từ Frontend gửi lên, tránh lỗi bắt buộc mật khẩu
    public class UpdateUserDTO
    {
        public string Role { get; set; }
        public bool IsActive { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult> GetUsers(
            [FromQuery] string? searchEmail,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(searchEmail))
            {
                query = query.Where(u => u.Email.Contains(searchEmail));
            }

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var users = await query
                .OrderBy(u => u.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Phone,
                    u.Role,
                    u.IsActive
                })
                .ToListAsync();

            return Ok(new
            {
                Data = users,
                Pagination = new
                {
                    TotalItems = totalItems,
                    TotalPages = totalPages,
                    CurrentPage = page,
                    PageSize = pageSize
                }
            });
        }

        // PUT: api/Users/5 - FIX LỖI KHÓA/ĐỔI QUYỀN TÀI KHOẢN
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDTO userRequest)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng.");
            }

            // Chỉ cập nhật Role và IsActive từ Admin gửi lên
            user.Role = userRequest.Role;
            user.IsActive = userRequest.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin người dùng thành công." });
        }

        // DELETE: api/Users/5 - THÊM MỚI CHỨC NĂNG XÓA TÀI KHOẢN
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng để xóa.");
            }

            // Tính năng nâng cao: Kiểm tra nếu tài khoản này đang được giao quản lý khách sạn
            // Nếu xóa sẽ bị lỗi ràng buộc khóa ngoại (Foreign Key Exception) trong SQL Server
            var managesHotel = await _context.Hotels.AnyAsync(h => h.ManagerId == id);
            if (managesHotel)
            {
                return BadRequest(new { message = "Không thể xóa tài khoản này vì đang quản lý một khách sạn trên hệ thống. Hãy gỡ bỏ hoặc thay đổi quản lý của khách sạn đó trước!" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa tài khoản người dùng thành công." });
        }
    }
}