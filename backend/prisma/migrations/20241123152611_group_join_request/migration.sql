-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('USER', 'LOGGED_USER', 'MODERATOR', 'ADMIN') NOT NULL DEFAULT 'LOGGED_USER';

-- CreateTable
CREATE TABLE `UsersWaitingToJoinGroup` (
    `userId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    INDEX `UsersWaitingToJoin_groupId_fkey`(`groupId`),
    PRIMARY KEY (`userId`, `groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UsersWaitingToJoinGroup` ADD CONSTRAINT `UsersWaitingToJoinGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersWaitingToJoinGroup` ADD CONSTRAINT `UsersWaitingToJoinGroup_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
