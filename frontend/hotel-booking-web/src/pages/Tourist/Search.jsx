import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import HotelCard from "../../components/HotelCard";

export default function Search() {
  const [searchParams] = useSearchParams();
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

      if (filters.city) params.append("city", filters.city);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.roomType) params.append("roomType", filters.roomType);
      if (filters.checkIn) params.append("checkIn", filters.checkIn);
      if (filters.checkOut) params.append("checkOut", filters.checkOut);

      params.append("page", pagination.page);
      params.append("pageSize", pagination.pageSize);
      params.append("sortBy", sortOptions.sortBy);
      params.append("sortOrder", sortOptions.sortOrder);

      const response = await axios.get(
        `${API_BASE_URL}/Hotels/search?${params.toString()}`,
      );

      setHotels(response.data.data || []);

      if (response.data.pagination) {
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          page: response.data.pagination.currentPage,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [pagination.page, sortOptions.sortBy, sortOptions.sortOrder]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchHotels();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;

    let newSortBy = "name";
    let newSortOrder = "asc";

    if (value === "name_asc") {
      newSortBy = "name";
      newSortOrder = "asc";
    }
    if (value === "name_desc") {
      newSortBy = "name";
      newSortOrder = "desc";
    }
    if (value === "city_asc") {
      newSortBy = "city";
      newSortOrder = "asc";
    }
    if (value === "city_desc") {
      newSortBy = "city";
      newSortOrder = "desc";
    }

    setSortOptions({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const goToDetail = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <div
      className="search-page-container"
      style={{
        backgroundImage: `linear-gradient(
          rgba(255,255,255,0.35),
          rgba(255,255,255,0.45)
        ), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#2c3e50",
            textShadow: "1px 1px 5px rgba(255,255,255,0.8)",
          }}
        >
          Kết Quả Tìm Kiếm
        </h1>

        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            backdropFilter: "blur(6px)",
          }}
        >
          <SearchBar
            filters={filters}
            onInputChange={handleInputChange}
            onSearch={handleSearch}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            background: "rgba(255,255,255,0.75)",
            padding: "10px 20px",
            borderRadius: "10px",
            backdropFilter: "blur(4px)",
          }}
        >
          <span>
            Tìm thấy <strong>{hotels.length}</strong> khách sạn trên trang này.
          </span>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label>Sắp xếp theo:</label>

            <select
              value={`${sortOptions.sortBy}_${sortOptions.sortOrder}`}
              onChange={handleSortChange}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="name_asc">Tên (A-Z)</option>
              <option value="name_desc">Tên (Z-A)</option>
              <option value="city_asc">Thành phố (A-Z)</option>
              <option value="city_desc">Thành phố (Z-A)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p
            style={{
              textAlign: "center",
              padding: "40px",
              fontSize: "18px",
            }}
          >
            Đang tải dữ liệu...
          </p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))",
                gap: "20px",
              }}
            >
              {hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    onClick={() => goToDetail(hotel.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <HotelCard hotel={hotel} />
                  </div>
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "10px",
                    gridColumn: "1 / -1",
                  }}
                >
                  Chưa có dữ liệu phù hợp với bộ lọc.
                </p>
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "40px",
                }}
              >
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Trang trước
                </button>

                <span
                  style={{
                    padding: "8px 16px",
                    background: "#00a8ff",
                    color: "#fff",
                    borderRadius: "6px",
                  }}
                >
                  Trang {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
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
