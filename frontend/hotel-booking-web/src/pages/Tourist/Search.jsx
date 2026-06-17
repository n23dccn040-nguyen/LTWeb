import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import HotelCard from "../../components/HotelCard";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    roomType: searchParams.get("roomType") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
  });

  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page")) || 1,
    pageSize: 6,
    totalPages: 1,
  });

  const [sortOptions, setSortOptions] = useState({
    sortBy: searchParams.get("sortBy") || "name",
    sortOrder: searchParams.get("sortOrder") || "asc",
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = "http://localhost:5154/api";

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Nạp bộ lọc
      if (filters.city) params.append("city", filters.city);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.roomType) params.append("roomType", filters.roomType);
      if (filters.checkIn) params.append("checkIn", filters.checkIn);
      if (filters.checkOut) params.append("checkOut", filters.checkOut);
      
      // Nạp phân trang và sắp xếp
      params.append("page", pagination.page);
      params.append("pageSize", pagination.pageSize);
      params.append("sortBy", sortOptions.sortBy);
      params.append("sortOrder", sortOptions.sortOrder);

      const response = await axios.get(`${API_BASE_URL}/Hotels/search?${params.toString()}`);
      
      setHotels(response.data.data || []);
      if (response.data.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          page: response.data.pagination.currentPage
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động tìm kiếm khi phân trang hoặc sắp xếp thay đổi
  useEffect(() => {
    fetchHotels();
  }, [pagination.page, sortOptions.sortBy, sortOptions.sortOrder]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Đưa về trang 1 và gọi API khi bấm nút Tìm kiếm
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchHotels();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    let newSortBy = "name";
    let newSortOrder = "asc";

    if (value === "name_asc") { newSortBy = "name"; newSortOrder = "asc"; }
    if (value === "name_desc") { newSortBy = "name"; newSortOrder = "desc"; }
    if (value === "city_asc") { newSortBy = "city"; newSortOrder = "asc"; }
    if (value === "city_desc") { newSortBy = "city"; newSortOrder = "desc"; }

    setSortOptions({ sortBy: newSortBy, sortOrder: newSortOrder });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const goToDetail = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <div className="search-page-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Kết Quả Tìm Kiếm</h1>
      
      <div style={{ background: '#f5f7fa', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <SearchBar
          filters={filters}
          onInputChange={handleInputChange}
          onSearch={handleSearch}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span>Tìm thấy <strong>{hotels.length > 0 ? hotels.length : 0}</strong> khách sạn trên trang này.</span>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>Sắp xếp theo:</label>
          <select 
            value={`${sortOptions.sortBy}_${sortOptions.sortOrder}`} 
            onChange={handleSortChange}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="name_asc">Tên (A-Z)</option>
            <option value="name_desc">Tên (Z-A)</option>
            <option value="city_asc">Thành phố (A-Z)</option>
            <option value="city_desc">Thành phố (Z-A)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>Đang tải dữ liệu...</p>
        ) : (
          <>
            <div className="hotel-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <div key={hotel.id} onClick={() => goToDetail(hotel.id)} style={{ cursor: 'pointer' }}>
                    <HotelCard
                      hotel={hotel}
                      onOpenModal={() => goToDetail(hotel.id)}
                    />
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#95a5a6", padding: "40px", fontSize: "16px", gridColumn: "1 / -1" }}>
                  Chưa có dữ liệu phù hợp với bộ lọc.
                </p>
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                <button 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', background: pagination.page === 1 ? '#eee' : 'white', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Trang trước
                </button>
                <span style={{ padding: '8px 16px', background: 'var(--neon-blue)', color: 'white', borderRadius: '5px' }}>
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  style={{ padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', background: pagination.page === pagination.totalPages ? '#eee' : 'white', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}