CREATE DATABASE IF NOT EXISTS `sportsdb`;

USE `sportsdb`;

## CREATE USER IF NOT EXISTS dsw@'%' IDENTIFIED BY 'dsw';
## GRANT SELECT, INSERT, UPDATE, DELETE ON sportsdb.* TO dsw@'%';

CREATE TABLE IF NOT EXISTS `sportsdb`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(255) NOT NULL,
  `user_type` ENUM('Club', 'Athlete', 'Agent') NOT NULL DEFAULT 'Athlete',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);    

CREATE TABLE IF NOT EXISTS `sportsdb`.`athletes`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `nationality` VARCHAR(255) NOT NULL,
  `birth_date` DATE NOT NULL,
  `sport` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255) NOT NULL,
  `is_signed` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `sportsdb`.`clubs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `opening_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `sportsdb`.`agents`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `club_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id`) REFERENCES `users`(`id`),  
  FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`)
);

CREATE TABLE IF NOT EXISTS `sportsdb`.`messages`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sender_id` INT UNSIGNED NOT NULL,
  `receiver_id` INT UNSIGNED NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `sportsdb`.`posts`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `author_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `sportsdb`.`profiles`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `bio` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `sportsdb`.`friend_requests`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sender_id` INT UNSIGNED NOT NULL,
  `receiver_id` INT UNSIGNED NOT NULL,
  `status` ENUM('Pending', 'Accepted', 'Declined') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`),
  UNIQUE KEY (`sender_id`, `receiver_id`)
);

