USE [master]
GO

-- 1. Kiểm tra và xóa Database nếu đã tồn tại để tránh lỗi
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'HotelBookingDB')
BEGIN
	ALTER DATABASE [HotelBookingDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
	DROP DATABASE [HotelBookingDB];
END
GO

-- 2. Tạo Database (Sử dụng đường dẫn mặc định của SQL Server)
CREATE DATABASE [HotelBookingDB]
GO

USE [HotelBookingDB]
GO

-- =============================================
-- 3. TẠO BẢNG (CREATE TABLES)
-- =============================================

CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED ([MigrationId] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Hotels](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[City] [nvarchar](100) NOT NULL,
	[Address] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[ManagerId] [int] NULL,
 CONSTRAINT [PK_Hotels] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[PasswordHash] [nvarchar](max) NOT NULL,
	[Phone] [nvarchar](max) NOT NULL,
	[Role] [nvarchar](max) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[RoomTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[HotelId] [int] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
	[BedType] [nvarchar](max) NOT NULL,
	[RoomView] [nvarchar](max) NOT NULL,
	[HasBathtub] [bit] NOT NULL,
	[Amenities] [nvarchar](max) NOT NULL,
	[ImageUrl] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_RoomTypes] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[Rooms](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoomTypeId] [int] NOT NULL,
	[RoomNumber] [nvarchar](50) NOT NULL,
	[IsMaintenance] [bit] NOT NULL,
	[IsAvailable] [bit] NOT NULL DEFAULT (0),
 CONSTRAINT [PK_Rooms] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[Bookings](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GuestName] [nvarchar](100) NOT NULL,
	[GuestPhone] [nvarchar](max) NOT NULL,
	[RoomTypeId] [int] NOT NULL,
	[RoomQuantity] [int] NOT NULL,
	[CheckInDate] [datetime2](7) NOT NULL,
	[CheckOutDate] [datetime2](7) NOT NULL,
	[TotalPrice] [decimal](18, 2) NOT NULL,
	[Status] [nvarchar](max) NOT NULL,
	[UserId] [int] NULL,
 CONSTRAINT [PK_Bookings] PRIMARY KEY CLUSTERED ([Id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- =============================================
-- 4. CHÈN DỮ LIỆU (INSERT DATA)
-- =============================================

INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260525020947_InitialCreate', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260525045736_AddIsAvailableToRoom', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260525054812_UpdateHotelModel', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260615215909_AddJWTAuth', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260615221615_AddUserIdToBooking', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260616101431_AddManagerIdToHotel', N'10.0.8')
GO

SET IDENTITY_INSERT [dbo].[Hotels] ON 
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (11, N'Sofitel Legend Metropole Hà Nội', N'Hà Nội', N'15 Ngô Quyền, Quận Hoàn Kiếm', N'Khách sạn mang đậm kiến trúc Pháp cổ kính, nổi bật với sự sang trọng và bề dày lịch sử hơn một thế kỷ ngay giữa lòng thủ đô.', 3)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (12, N'Sapa Jade Hill Resort & Spa', N'Lào Cai', N'Thôn Lý, Xã Lao Chải, Thị xã Sa Pa', N'Khu nghỉ dưỡng sinh thái độc đáo với các biệt thự mái cọ ẩn mình giữa thung lũng sương mù và ruộng bậc thang hùng vĩ.', 3)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (13, N'Vinpearl Resort & Spa Đà Nẵng', N'Đà Nẵng', N'23 Trường Sa, Phường Hải Hòa, Quận Ngũ Hành Sơn', N'Khu nghỉ dưỡng 5 sao ven biển với kiến trúc tân cổ điển, sở hữu hệ thống hồ bơi vô cực tuyệt đẹp và bãi biển riêng tư.', 3)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (14, N'Little Riverside Hoi An', N'Quảng Nam', N'09 Phan Bội Châu, Phường Cẩm Châu, TP. Hội An', N'Khách sạn mang phong cách boutique hoài cổ, nằm hiền hòa bên bờ sông Thu Bồn thơ mộng, chỉ cách phố cổ vài bước chân.', 3)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (15, N'Ana Mandara Villas Dalat', N'Lâm Đồng', N'Đường Lê Lai, Phường 5, TP. Đà Lạt', N'Quần thể biệt thự cổ kiểu Pháp được phục dựng nguyên bản, nằm lọt thỏm giữa những đồi thông xanh mát và yên tĩnh.', 3)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (16, N'Havana Nha Trang Hotel', N'Khánh Hòa', N'38 Trần Phú, Phường Lộc Thọ, TP. Nha Trang', N'Khách sạn cao tầng hiện đại bậc nhất mặt đường Trần Phú, với đường hầm xuyên biển độc đáo và tầm nhìn toàn cảnh vịnh Nha Trang.', 3)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (17, N'Caravelle Saigon Hotel', N'Hồ Chí Minh', N'19-23 Công trường Lam Sơn, Quận 1', N'Biểu tượng lưu trú sang trọng tọa lạc ngay "trái tim" Sài Gòn, liền kề Nhà hát Thành phố và các khu mua sắm sầm uất.', 3)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (18, N'Sunset Sanato Resort & Villas', N'Kiên Giang', N'Bắc Bãi Trường, Tổ 3, Ấp Đường Bào, Xã Dương Tơ, TP. Phú Quốc', N'Khu nghỉ dưỡng phức hợp ven biển nổi tiếng với các kiến trúc nghệ thuật trên cát và là nơi ngắm hoàng hôn đẹp nhất đảo ngọc.', 3)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (19, N'Mường Thanh Luxury Quảng Ninh', N'Quảng Ninh', N'Tổ 1, Khu 2, Phường Bãi Cháy, TP. Hạ Long', N'Khách sạn quy mô lớn với thiết kế kính sang trọng, cung cấp tầm nhìn ôm trọn Di sản thiên nhiên thế giới Vịnh Hạ Long.', 3)
INSERT [dbo].[Hotels] ([Id], [Name], [City], [Address], [Description], [ManagerId]) VALUES (20, N'The Imperial Hotel Vũng Tàu', N'Bà Rịa - Vũng Tàu', N'159 Thùy Vân, Phường Thắng Tam, TP. Vũng Tàu', N'Khách sạn duy nhất tại Vũng Tàu lấy cảm hứng từ kiến trúc phục hưng Châu Âu nguy nga, lộng lẫy ngay sát bãi biển.', 3)
SET IDENTITY_INSERT [dbo].[Hotels] OFF
GO

SET IDENTITY_INSERT [dbo].[Users] ON 
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (1, N'huu', N'huuqt@gmail.com', N'$2a$11$RGB.URm0bmRNfo9.C6YFNunjL9LDBOn2C8i72mS6yZIo1T5S9i536', N'0393333333', N'Tourist', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (2, N'admin', N'admin@gmail.com', N'$2a$11$uCxT4S5GMdRUuVYP7CTIoeRA5iRli553nbDaPas8k/L3iDEzn11Zm', N'03999990', N'Admin', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (3, N'Manager', N'manager@gmail.com', N'$2a$11$WaVtGkNs3BktxtidtC5eeegNyY9xuajSVR4fHC41E6AUFnhQe2XfW', N'039999901', N'HotelManager', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (4, N'Quản trị viên', N'admin@example.com', N'$2a$11$GN6dGGUn8v4JAEkNfOqK0eW3.gXTEKz4kPp2.n2T5VdZ5v8X8YM/a', N'0123456789', N'Admin', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (7, N'Test Admin', N'testadmin@example.com', N'$2a$11$BkIBY0TJWwnk.Ce9NM1kiO024d6yJc6LuK4eiXX1bnvpXzzyrffHu', N'0123456789', N'Admin', 1)
INSERT [dbo].[Users] ([Id], [FullName], [Email], [PasswordHash], [Phone], [Role], [IsActive]) VALUES (8, N'Manager Test', N'mgr2@example.com', N'$2a$11$Lx1CffaRyINj2UkwMPK2rug5fK5xJPdYPl83spuCxIMXgvSa1xAmq', N'0987654321', N'HotelManager', 1)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO

SET IDENTITY_INSERT [dbo].[RoomTypes] ON 
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (12, 11, N'Premium Century Room', CAST(4500000.00 AS Decimal(18, 2)), N'1 Giường King (Cỡ lớn)', N'Hướng sân vườn trong nhà (Courtyard)', 1, N'Máy pha Espresso, Nội thất tân cổ điển, Dịch vụ chỉnh trang phòng', N'https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/95/2016/12/21150217/3557979_XL-1.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (13, 11, N'Classic Room', CAST(2000000.00 AS Decimal(18, 2)), N'Giường đôi', N'View Hồ đá', 1, N'Đầy đủ tiện nghi, máy lạnh, bàn Bida', N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh21szB2ZEwNnn_OC1uNyLm-8dkD8rqVwxvA&s')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (14, 12, N'Bungalow Mountain View', CAST(2800000.00 AS Decimal(18, 2)), N'1 Giường đôi lớn', N'Thung lũng Mường Hoa & Ruộng bậc thang', 1, N'Lò sưởi củi, Ban công riêng, Miễn phí trà thảo mộc', N'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (15, 13, N'Deluxe Ocean View', CAST(3200000.00 AS Decimal(18, 2)), N'2 Giường đơn (Twin)', N'Trực diện Biển Non Nước', 1, N'Ban công, Smart TV 55 inch, Tủ lạnh Minibar', N'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (16, 14, N'Little Suite River View', CAST(2100000.00 AS Decimal(18, 2)), N'1 Giường King', N'Sông Thu Bồn', 1, N'Xe đạp miễn phí, Bàn làm việc cổ điển, Nước suối hàng ngày', N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHp-GXhisTRvSgmRXsoAnC7vVuADUi1LUNsg&s')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (17, 15, N'Le Petit Room', CAST(1900000.00 AS Decimal(18, 2)), N'1 Giường đôi (Queen)', N'Đồi thông & Vườn hoa', 1, N'Quạt sưởi, Sàn gỗ sồi, Kiến trúc Pháp nguyên bản', N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4WFCBiuo04xliySYlxYzDCqlQ7c3aiVzyEA&s')
-- ĐÃ SỬA LỖI Ở DÒNG INSERT NÀY (Thay đoạn Base64 dài bằng URL ngắn)
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (18, 16, N'Club Suite Ocean View', CAST(3500000.00 AS Decimal(18, 2)), N'1 Giường đôi & 1 Giường đơn (Family)', N'Toàn cảnh Vịnh Nha Trang', 1, N'Đặc quyền Club Lounge, Cửa sổ kính sát trần, Bếp nhỏ', N'https://via.placeholder.com/800x600?text=Club+Suite+Ocean+View')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (19, 17, N'Signature Studio', CAST(4200000.00 AS Decimal(18, 2)), N'1 Giường King siêu lớn', N'Nhà hát Thành phố', 1, N'Máy lọc không khí, Chăn ga lụa tơ tằm, Khu vực sofa tiếp khách', N'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (20, 18, N'Standard Sunset Room', CAST(2500000.00 AS Decimal(18, 2)), N'1 Giường đôi', N'Hồ bơi trung tâm', 1, N'Ghế dài tắm nắng ngoài hiên, Miễn phí vé khu check-in nghệ thuật', N'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (21, 19, N'Executive Suite', CAST(3800000.00 AS Decimal(18, 2)), N'1 Giường King', N'Vịnh Hạ Long & Vòng quay Mặt Trời', 1, N'Bàn làm việc giám đốc, Khu vực ăn uống riêng, Phục vụ 24/7', N'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (22, 20, N'Grand Deluxe King', CAST(3100000.00 AS Decimal(18, 2)), N'1 Giường King phong cách hoàng gia', N'Biển Thùy Vân', 1, N'Nội thất gỗ gụ, Giấy dán tường cổ điển, Dép đi trong nhà cao cấp', N'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop')
SET IDENTITY_INSERT [dbo].[RoomTypes] OFF
GO

SET IDENTITY_INSERT [dbo].[Rooms] ON 
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (18, 12, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (19, 12, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (20, 12, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (21, 12, N'202', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (22, 13, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (23, 13, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (24, 14, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (25, 14, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (26, 15, N'1', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (27, 15, N'2', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (28, 16, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (29, 16, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (30, 16, N'301', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (31, 16, N'401', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (32, 17, N'101', 0, 0)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (33, 17, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (34, 18, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (35, 18, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (36, 18, N'301', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (37, 19, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (38, 19, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (39, 19, N'201', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (40, 19, N'202', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (41, 19, N'301', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (42, 19, N'302', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (43, 20, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (44, 20, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (45, 21, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (46, 21, N'102', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (47, 21, N'103', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (48, 22, N'101', 0, 1)
INSERT [dbo].[Rooms] ([Id], [RoomTypeId], [RoomNumber], [IsMaintenance], [IsAvailable]) VALUES (49, 22, N'102', 0, 1)
SET IDENTITY_INSERT [dbo].[Rooms] OFF
GO

SET IDENTITY_INSERT [dbo].[Bookings] ON 
INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (7, N'huu', N'03333333', 17, 1, CAST(N'2026-06-23T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-26T00:00:00.0000000' AS DateTime2), CAST(5700000.00 AS Decimal(18, 2)), N'CheckedIn', 1)
SET IDENTITY_INSERT [dbo].[Bookings] OFF
GO

-- =============================================
-- 5. TẠO CHỈ MỤC & KHÓA NGOẠI (INDEXES & FOREIGN KEYS)
-- =============================================

CREATE NONCLUSTERED INDEX [IX_Bookings_RoomTypeId] ON [dbo].[Bookings] ([RoomTypeId] ASC)
GO
CREATE NONCLUSTERED INDEX [IX_Rooms_RoomTypeId] ON [dbo].[Rooms] ([RoomTypeId] ASC)
GO
CREATE NONCLUSTERED INDEX [IX_RoomTypes_HotelId] ON [dbo].[RoomTypes] ([HotelId] ASC)
GO

ALTER TABLE [dbo].[Bookings] WITH CHECK ADD CONSTRAINT [FK_Bookings_RoomTypes_RoomTypeId] FOREIGN KEY([RoomTypeId]) REFERENCES [dbo].[RoomTypes] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Rooms] WITH CHECK ADD CONSTRAINT [FK_Rooms_RoomTypes_RoomTypeId] FOREIGN KEY([RoomTypeId]) REFERENCES [dbo].[RoomTypes] ([Id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RoomTypes] WITH CHECK ADD CONSTRAINT [FK_RoomTypes_Hotels_HotelId] FOREIGN KEY([HotelId]) REFERENCES [dbo].[Hotels] ([Id]) ON DELETE CASCADE
GO

PRINT 'Tạo Database HotelBookingDB và chèn dữ liệu thành công!'