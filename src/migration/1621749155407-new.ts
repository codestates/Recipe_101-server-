import {MigrationInterface, QueryRunner} from "typeorm";

export class new1621749155407 implements MigrationInterface {
    name = 'new1621749155407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `ff` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `targetId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `ingredients` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `cap` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `foodInfoId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `recipe` (`id` int NOT NULL AUTO_INCREMENT, `cookingNo` int NOT NULL, `cookingDc` varchar(255) NOT NULL, `stepImage` varchar(255) NOT NULL, `stepTip` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `foodInfoId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `food_info` (`id` int NOT NULL AUTO_INCREMENT, `foodName` varchar(255) NOT NULL, `summary` varchar(255) NOT NULL, `nation` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `cookingTime` varchar(255) NOT NULL, `calorie` varchar(255) NOT NULL, `qnt` varchar(255) NOT NULL, `level` varchar(255) NOT NULL, `irdntCode` varchar(255) NOT NULL, `price` varchar(255) NOT NULL, `imgUrl` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `store` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NULL, `foodInfoId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `userName` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `password2` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `phone` varchar(255) NOT NULL, `userImage` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `comment` (`id` int NOT NULL AUTO_INCREMENT, `comment` varchar(255) NOT NULL, `score` int NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `foodInfoId` int NULL, `userId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `ff` ADD CONSTRAINT `FK_c499e07a2505f2e44ab0f770b26` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ff` ADD CONSTRAINT `FK_3548bab9306e6b3e5b56b74af70` FOREIGN KEY (`targetId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `ingredients` ADD CONSTRAINT `FK_4f8ad65a265241c2eb0d21404a3` FOREIGN KEY (`foodInfoId`) REFERENCES `food_info`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipe` ADD CONSTRAINT `FK_c2ffa977695bd8ced914a8c728a` FOREIGN KEY (`foodInfoId`) REFERENCES `food_info`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `food_info` ADD CONSTRAINT `FK_69412cbed0d17d80a7557a619e9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `store` ADD CONSTRAINT `FK_3f82dbf41ae837b8aa0a27d29c3` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `store` ADD CONSTRAINT `FK_2b11b4c8fe2c37b140e21f76999` FOREIGN KEY (`foodInfoId`) REFERENCES `food_info`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `FK_4d9e5dd01b17f6514fb17525829` FOREIGN KEY (`foodInfoId`) REFERENCES `food_info`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `FK_c0354a9a009d3bb45a08655ce3b`");
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `FK_4d9e5dd01b17f6514fb17525829`");
        await queryRunner.query("ALTER TABLE `store` DROP FOREIGN KEY `FK_2b11b4c8fe2c37b140e21f76999`");
        await queryRunner.query("ALTER TABLE `store` DROP FOREIGN KEY `FK_3f82dbf41ae837b8aa0a27d29c3`");
        await queryRunner.query("ALTER TABLE `food_info` DROP FOREIGN KEY `FK_69412cbed0d17d80a7557a619e9`");
        await queryRunner.query("ALTER TABLE `recipe` DROP FOREIGN KEY `FK_c2ffa977695bd8ced914a8c728a`");
        await queryRunner.query("ALTER TABLE `ingredients` DROP FOREIGN KEY `FK_4f8ad65a265241c2eb0d21404a3`");
        await queryRunner.query("ALTER TABLE `ff` DROP FOREIGN KEY `FK_3548bab9306e6b3e5b56b74af70`");
        await queryRunner.query("ALTER TABLE `ff` DROP FOREIGN KEY `FK_c499e07a2505f2e44ab0f770b26`");
        await queryRunner.query("DROP TABLE `comment`");
        await queryRunner.query("DROP TABLE `user`");
        await queryRunner.query("DROP TABLE `store`");
        await queryRunner.query("DROP TABLE `food_info`");
        await queryRunner.query("DROP TABLE `recipe`");
        await queryRunner.query("DROP TABLE `ingredients`");
        await queryRunner.query("DROP TABLE `ff`");
    }

}
