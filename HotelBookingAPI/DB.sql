USE [master]
GO
/****** Object:  Database [HotelBookingDB]    Script Date: 6/19/2026 2:47:45 AM ******/
CREATE DATABASE [HotelBookingDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'HotelBookingDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\HotelBookingDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'HotelBookingDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\HotelBookingDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [HotelBookingDB] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [HotelBookingDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [HotelBookingDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [HotelBookingDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [HotelBookingDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [HotelBookingDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [HotelBookingDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [HotelBookingDB] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [HotelBookingDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [HotelBookingDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [HotelBookingDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [HotelBookingDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [HotelBookingDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [HotelBookingDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [HotelBookingDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [HotelBookingDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [HotelBookingDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [HotelBookingDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [HotelBookingDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [HotelBookingDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [HotelBookingDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [HotelBookingDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [HotelBookingDB] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [HotelBookingDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [HotelBookingDB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [HotelBookingDB] SET  MULTI_USER 
GO
ALTER DATABASE [HotelBookingDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [HotelBookingDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [HotelBookingDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [HotelBookingDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [HotelBookingDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [HotelBookingDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [HotelBookingDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [HotelBookingDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [HotelBookingDB]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 6/19/2026 2:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Bookings]    Script Date: 6/19/2026 2:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
 CONSTRAINT [PK_Bookings] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Hotels]    Script Date: 6/19/2026 2:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Hotels](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[City] [nvarchar](100) NOT NULL,
	[Address] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[ManagerId] [int] NULL,
 CONSTRAINT [PK_Hotels] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rooms]    Script Date: 6/19/2026 2:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rooms](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoomTypeId] [int] NOT NULL,
	[RoomNumber] [nvarchar](50) NOT NULL,
	[IsMaintenance] [bit] NOT NULL,
	[IsAvailable] [bit] NOT NULL,
 CONSTRAINT [PK_Rooms] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoomTypes]    Script Date: 6/19/2026 2:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
 CONSTRAINT [PK_RoomTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 6/19/2026 2:47:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[PasswordHash] [nvarchar](max) NOT NULL,
	[Phone] [nvarchar](max) NOT NULL,
	[Role] [nvarchar](max) NOT NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260525020947_InitialCreate', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260525045736_AddIsAvailableToRoom', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260525054812_UpdateHotelModel', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260615215909_AddJWTAuth', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260615221615_AddUserIdToBooking', N'10.0.8')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20260616101431_AddManagerIdToHotel', N'10.0.8')
GO
SET IDENTITY_INSERT [dbo].[Bookings] ON 

INSERT [dbo].[Bookings] ([Id], [GuestName], [GuestPhone], [RoomTypeId], [RoomQuantity], [CheckInDate], [CheckOutDate], [TotalPrice], [Status], [UserId]) VALUES (7, N'huu', N'03333333', 17, 1, CAST(N'2026-06-23T00:00:00.0000000' AS DateTime2), CAST(N'2026-06-26T00:00:00.0000000' AS DateTime2), CAST(5700000.00 AS Decimal(18, 2)), N'CheckedIn', 1)
SET IDENTITY_INSERT [dbo].[Bookings] OFF
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
SET IDENTITY_INSERT [dbo].[RoomTypes] ON 

INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (12, 11, N'Premium Century Room', CAST(4500000.00 AS Decimal(18, 2)), N'1 Giường King (Cỡ lớn)', N'Hướng sân vườn trong nhà (Courtyard)', 1, N'Máy pha Espresso, Nội thất tân cổ điển, Dịch vụ chỉnh trang phòng', N'https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/95/2016/12/21150217/3557979_XL-1.jpg')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (13, 11, N'Classic Room', CAST(2000000.00 AS Decimal(18, 2)), N'Giường đôi', N'View Hồ đá', 1, N'Đầy đủ tiện nghi, máy lạnh, bàn Bida', N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh21szB2ZEwNnn_OC1uNyLm-8dkD8rqVwxvA&s')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (14, 12, N'Bungalow Mountain View', CAST(2800000.00 AS Decimal(18, 2)), N'1 Giường đôi lớn', N'Thung lũng Mường Hoa & Ruộng bậc thang', 1, N'Lò sưởi củi, Ban công riêng, Miễn phí trà thảo mộc', N'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (15, 13, N'Deluxe Ocean View', CAST(3200000.00 AS Decimal(18, 2)), N'2 Giường đơn (Twin)', N'Trực diện Biển Non Nước', 1, N'Ban công, Smart TV 55 inch, Tủ lạnh Minibar', N'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (16, 14, N'Little Suite River View', CAST(2100000.00 AS Decimal(18, 2)), N'1 Giường King', N'Sông Thu Bồn', 1, N'Xe đạp miễn phí, Bàn làm việc cổ điển, Nước suối hàng ngày', N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHp-GXhisTRvSgmRXsoAnC7vVuADUi1LUNsg&s')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (17, 15, N'Le Petit Room', CAST(1900000.00 AS Decimal(18, 2)), N'1 Giường đôi (Queen)', N'Đồi thông & Vườn hoa', 1, N'Quạt sưởi, Sàn gỗ sồi, Kiến trúc Pháp nguyên bản', N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4WFCBiuo04xliySYlxYzDCqlQ7c3aiVzyEA&s')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (18, 16, N'Club Suite Ocean View', CAST(3500000.00 AS Decimal(18, 2)), N'1 Giường đôi & 1 Giường đơn (Family)', N'Toàn cảnh Vịnh Nha Trang', 1, N'Đặc quyền Club Lounge, Cửa sổ kính sát trần, Bếp nhỏ', N'data:image/jpeg;base64,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')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (19, 17, N'Signature Studio', CAST(4200000.00 AS Decimal(18, 2)), N'1 Giường King siêu lớn', N'Nhà hát Thành phố', 1, N'Máy lọc không khí, Chăn ga lụa tơ tằm, Khu vực sofa tiếp khách', N'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (20, 18, N'Standard Sunset Room', CAST(2500000.00 AS Decimal(18, 2)), N'1 Giường đôi', N'Hồ bơi trung tâm', 1, N'Ghế dài tắm nắng ngoài hiên, Miễn phí vé khu check-in nghệ thuật', N'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (21, 19, N'Executive Suite', CAST(3800000.00 AS Decimal(18, 2)), N'1 Giường King', N'Vịnh Hạ Long & Vòng quay Mặt Trời', 1, N'Bàn làm việc giám đốc, Khu vực ăn uống riêng, Phục vụ 24/7', N'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop')
INSERT [dbo].[RoomTypes] ([Id], [HotelId], [Name], [Price], [BedType], [RoomView], [HasBathtub], [Amenities], [ImageUrl]) VALUES (22, 20, N'Grand Deluxe King', CAST(3100000.00 AS Decimal(18, 2)), N'1 Giường King phong cách hoàng gia', N'Biển Thùy Vân', 1, N'Nội thất gỗ gụ, Giấy dán tường cổ điển, Dép đi trong nhà cao cấp', N'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop')
SET IDENTITY_INSERT [dbo].[RoomTypes] OFF
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
/****** Object:  Index [IX_Bookings_RoomTypeId]    Script Date: 6/19/2026 2:47:45 AM ******/
CREATE NONCLUSTERED INDEX [IX_Bookings_RoomTypeId] ON [dbo].[Bookings]
(
	[RoomTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_Rooms_RoomTypeId]    Script Date: 6/19/2026 2:47:45 AM ******/
CREATE NONCLUSTERED INDEX [IX_Rooms_RoomTypeId] ON [dbo].[Rooms]
(
	[RoomTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_RoomTypes_HotelId]    Script Date: 6/19/2026 2:47:45 AM ******/
CREATE NONCLUSTERED INDEX [IX_RoomTypes_HotelId] ON [dbo].[RoomTypes]
(
	[HotelId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Rooms] ADD  DEFAULT (CONVERT([bit],(0))) FOR [IsAvailable]
GO
ALTER TABLE [dbo].[Bookings]  WITH CHECK ADD  CONSTRAINT [FK_Bookings_RoomTypes_RoomTypeId] FOREIGN KEY([RoomTypeId])
REFERENCES [dbo].[RoomTypes] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Bookings] CHECK CONSTRAINT [FK_Bookings_RoomTypes_RoomTypeId]
GO
ALTER TABLE [dbo].[Rooms]  WITH CHECK ADD  CONSTRAINT [FK_Rooms_RoomTypes_RoomTypeId] FOREIGN KEY([RoomTypeId])
REFERENCES [dbo].[RoomTypes] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Rooms] CHECK CONSTRAINT [FK_Rooms_RoomTypes_RoomTypeId]
GO
ALTER TABLE [dbo].[RoomTypes]  WITH CHECK ADD  CONSTRAINT [FK_RoomTypes_Hotels_HotelId] FOREIGN KEY([HotelId])
REFERENCES [dbo].[Hotels] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RoomTypes] CHECK CONSTRAINT [FK_RoomTypes_Hotels_HotelId]
GO
USE [master]
GO
ALTER DATABASE [HotelBookingDB] SET  READ_WRITE 
GO
