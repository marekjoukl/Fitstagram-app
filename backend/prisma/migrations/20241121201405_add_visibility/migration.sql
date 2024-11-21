-- CreateTable
CREATE TABLE `UsersWhoCanSeePhotos` (
    `userId` INTEGER NOT NULL,
    `photoId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `photoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UsersWhoCanSeePhotos` ADD CONSTRAINT `UsersWhoCanSeePhotos_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersWhoCanSeePhotos` ADD CONSTRAINT `UsersWhoCanSeePhotos_photoId_fkey` FOREIGN KEY (`photoId`) REFERENCES `Photo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
