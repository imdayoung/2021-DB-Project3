#create schema kakao;
#use kakao;​

CREATE TABLE `MEMBER`(
	`name` VARCHAR(10) NOT NULL,
    `id` VARCHAR(15) NOT NULL,
    `pwd` VARCHAR(20) NOT NULL,
    `sex` CHAR NOT NULL,
    `phone` VARCHAR(13),
    `birth` VARCHAR(10),
    `nickname` VARCHAR(10),
    `comment` VARCHAR(100),
    `profileimage` VARCHAR(50),
    `backgroundimage` VARCHAR(50),
    `profilemusic` VARCHAR(50),
    PRIMARY KEY (`id`));
    
CREATE TABLE `FRIEND` (
	`id1` VARCHAR(15),
    `id2` VARCHAR(15),
    FOREIGN KEY(`id1`) REFERENCES `MEMBER` (`id`),
    FOREIGN KEY(`id2`) REFERENCES `MEMBER` (`id`));
    
CREATE TABLE `CHAT` (
	`id1` VARCHAR(15),
    `id2` VARCHAR(15),
    `content` VARCHAR(100),
    `time` TIME);