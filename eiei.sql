create database if not exists queue_db;
Use queue_db;


CREATE TABLE IF NOT EXISTS `queue_admin`(
    `id` int(11) not null auto_increment,
    `username` text not null,
    `email` text not null,
    `password` text not null,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `queue_students`(
    `id` int(11) not null auto_increment,
    `student_id` VARCHAR(20) not null,
    `username` text not null,
    `password` text not null,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `queue_contact`(
    `id` int(11) not null auto_increment,
    `username` text NOT NULL,
    `email` text NOT NULL,
    `subject` text NOT NULL,
    `message` text NOT NULL,
    `date` text NOT NULL,
    PRIMARY KEY (`id`)
);

    
