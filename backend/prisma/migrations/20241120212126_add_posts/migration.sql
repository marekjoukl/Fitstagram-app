/*
  Warnings:

  - Added the required column `url` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Photo` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;
