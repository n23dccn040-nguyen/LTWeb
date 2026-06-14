IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Hotels] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(200) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [Address] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Hotels] PRIMARY KEY ([Id])
);

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [FullName] nvarchar(100) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [Role] nvarchar(max) NOT NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

CREATE TABLE [RoomTypes] (
    [Id] int NOT NULL IDENTITY,
    [HotelId] int NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [BedType] nvarchar(max) NOT NULL,
    [RoomView] nvarchar(max) NOT NULL,
    [HasBathtub] bit NOT NULL,
    [Amenities] nvarchar(max) NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_RoomTypes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RoomTypes_Hotels_HotelId] FOREIGN KEY ([HotelId]) REFERENCES [Hotels] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Bookings] (
    [Id] int NOT NULL IDENTITY,
    [GuestName] nvarchar(100) NOT NULL,
    [GuestPhone] nvarchar(max) NOT NULL,
    [RoomTypeId] int NOT NULL,
    [RoomQuantity] int NOT NULL,
    [CheckInDate] datetime2 NOT NULL,
    [CheckOutDate] datetime2 NOT NULL,
    [TotalPrice] decimal(18,2) NOT NULL,
    [Status] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Bookings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Bookings_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Rooms] (
    [Id] int NOT NULL IDENTITY,
    [RoomTypeId] int NOT NULL,
    [RoomNumber] nvarchar(50) NOT NULL,
    [IsMaintenance] bit NOT NULL,
    CONSTRAINT [PK_Rooms] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Rooms_RoomTypes_RoomTypeId] FOREIGN KEY ([RoomTypeId]) REFERENCES [RoomTypes] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Bookings_RoomTypeId] ON [Bookings] ([RoomTypeId]);

CREATE INDEX [IX_Rooms_RoomTypeId] ON [Rooms] ([RoomTypeId]);

CREATE INDEX [IX_RoomTypes_HotelId] ON [RoomTypes] ([HotelId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260525020947_InitialCreate', N'10.0.8');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Rooms] ADD [IsAvailable] bit NOT NULL DEFAULT CAST(0 AS bit);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260525045736_AddIsAvailableToRoom', N'10.0.8');

COMMIT;
GO

BEGIN TRANSACTION;
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260525054812_UpdateHotelModel', N'10.0.8');

COMMIT;
GO

