create database if not exists queue_db;
Use queue_db;


CREATE TABLE IF NOT EXISTS `queue_admin`(
    `id` int(11) not null auto_increment,
    `username` text not null,
    `email` text not null,
    `password` text not null,
    PRIMARY KEY (`id`)
);

INSERT INTO queue_admin (username, email, password)
VALUES ('admin', 'admin@gmail.com', '1234');

-- NOTE: avoid dropping `queue_students` automatically here to prevent
-- accidental data loss when running this script on a production DB.
-- DROP TABLE IF EXISTS queue_students;
CREATE TABLE IF NOT EXISTS `queue_students`(
    `id` int(11) not null auto_increment,
    `student_id` VARCHAR(20) not null,
    `username` text not null,
    `password` text not null,
    PRIMARY KEY (`id`)
);

-- Add a small test account if none exists (safe to run multiple times)
INSERT INTO queue_students (student_id, username, password)
SELECT 'test123', 'Test User', '1234'
WHERE NOT EXISTS (SELECT 1 FROM queue_students WHERE student_id = 'test123');

CREATE TABLE IF NOT EXISTS `queue_contact`(
    `id` int(11) not null auto_increment,
    `username` text NOT NULL,
    `email` text NOT NULL,
    `subject` text NOT NULL,
    `message` text NOT NULL,
    `date` text NOT NULL,
    `status` text NOT NULL DEFAULT 'จองแล้ว',
    PRIMARY KEY (`id`)
);

    
