-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 13, 2025 at 10:06 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `candidate1`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL,
  `name` varchar(225) NOT NULL,
  `studentID` varchar(50) NOT NULL,
  `school_id` int(11) DEFAULT NULL,
  `major_id` int(11) DEFAULT NULL,
  `line_id` varchar(50) DEFAULT NULL,
  `gpax` decimal(3,2) DEFAULT NULL,
  `gpax_level` enum('High school transcript(1st year only)','Bachelor transcript') DEFAULT NULL,
  `candidate_type` enum('President of the Student Union Candidate','Student Council Member (School of Study)','Student Council Member (Normal)','President of the Faculty Student Council') DEFAULT NULL,
  `picture_url` varchar(255) DEFAULT NULL,
  `transcript_url` varchar(255) DEFAULT NULL,
  `policy_poster_url` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','Declined') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `name`, `studentID`, `school_id`, `major_id`, `line_id`, `gpax`, `gpax_level`, `candidate_type`, `picture_url`, `transcript_url`, `policy_poster_url`, `status`) VALUES
(50, 'tonkhow', '6531501090', 2, 3, 'sdfssffs', 3.26, 'Bachelor transcript', 'Student Council Member (Normal)', 'uploads\\a45d4144d7a1cac5cee6516001023de2', 'uploads\\11281039e48ef6b870283a201483e2ea', 'uploads\\6ca1786b241afde625d552d7c4abd2be', 'Declined'),
(51, 'moodang', '6531501073', 2, 3, 'ee', 3.50, 'High school transcript(1st year only)', 'Student Council Member (School of Study)', 'uploads\\aaea6a5be8cd5cf0337147fdd5b683f1', 'uploads\\056268b540ee9430e3a567b2f122a96b', 'uploads\\68ee31af2bf208062e06a9cdc29d235e', 'Approved'),
(52, 'pimnara', '6531501091', 2, 3, 'll', 3.65, 'Bachelor transcript', 'President of the Faculty Student Council', 'uploads\\e9bfa995234c3b43a75b80fcded26c4a', 'uploads\\9637c817ed2d689c83e8dff84fb35cc9', 'uploads\\48815bbdcb98629ada0a45946f4d8f64', 'Pending'),
(53, 'natdhanai', '6331601052', 7, 18, 'll', 3.20, 'Bachelor transcript', 'President of the Faculty Student Council', 'uploads\\f56fffc96639de9696564d2f8db841a1', 'uploads\\9e343dd84eaf35a84d3d6080befa1d28', 'uploads\\e6d5c46f36e34c7a20f64a2791ddf6ef', 'Pending'),
(54, 'Test', '6531501098', 2, 3, 'scsd', 3.26, 'Bachelor transcript', 'President of the Student Union Candidate', 'uploads\\0aac299fb7135a3936254387eae8e0e3', 'uploads\\4d54a528c84d00f13bb26e9032c74d76', 'uploads\\9973102475d9b926afd26269971e49a3', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `headers`
--

CREATE TABLE `headers` (
  `id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `headers`
--

INSERT INTO `headers` (`id`, `text`) VALUES
(1, 'President of the Student Union Candidates'),
(2, 'Student Council Member (school of study)'),
(3, 'Student Council Member (Normal)');

-- --------------------------------------------------------

--
-- Table structure for table `majors`
--

CREATE TABLE `majors` (
  `id` int(11) NOT NULL,
  `major_code` varchar(20) NOT NULL,
  `major_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `majors`
--

INSERT INTO `majors` (`id`, `major_code`, `major_name`) VALUES
(1, 'major1', 'Innovative Food Science and Technology'),
(2, 'major2', 'Postharvest Technology and Logistics'),
(3, 'major3', 'Computer Engineering'),
(4, 'major4', 'Digital and Communication Engineering'),
(5, 'major5', 'Digital Technology for Business Innovation'),
(6, 'major6', 'Multimedia Technology and Animation'),
(7, 'major7', 'Software Engineering'),
(8, 'major8', 'Beauty Technology'),
(9, 'major9', 'Cosmetic Science'),
(10, 'major10', 'Dental Surgery'),
(11, 'major11', 'Environmental Health'),
(12, 'major12', 'Occupational Health and Safety'),
(13, 'major13', 'Public Health'),
(14, 'major14', 'Applied Thai Traditional Medicine'),
(15, 'major15', 'Physical Therapy'),
(16, 'major16', 'Traditional Chinese Medicine'),
(17, 'major17', 'Laws'),
(18, 'major18', 'Business Law and Chinese Communication'),
(19, 'major19', 'English'),
(20, 'major20', 'Thai Language and Culture for Foreigners'),
(21, 'major21', 'Accounting'),
(22, 'major22', 'Business Management'),
(23, 'major23', 'Economics'),
(24, 'major24', 'Medicine'),
(25, 'major25', 'Nursing Science'),
(26, 'major26', 'Applied Chemistry'),
(27, 'major27', 'Biotechnology'),
(28, 'major28', 'Materials Engineering'),
(29, 'major29', 'Business Chinese'),
(30, 'major30', 'Chinese Language and Culture'),
(31, 'major31', 'Chinese Studies'),
(32, 'major32', 'Teaching Chinese Language'),
(33, 'major33', 'International Development');

-- --------------------------------------------------------

--
-- Table structure for table `pdpa_content`
--

CREATE TABLE `pdpa_content` (
  `id` int(11) NOT NULL,
  `header_text` text DEFAULT NULL,
  `radio_label` text DEFAULT NULL,
  `swal_message` text DEFAULT NULL,
  `image_path` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pdpa_content`
--

INSERT INTO `pdpa_content` (`id`, `header_text`, `radio_label`, `swal_message`, `image_path`) VALUES
(1, 'PDPA', 'I agree to collect personal data', 'Lorem ipsum dolor sit amet. Sed ipsa pariatur non fuga ratione et vitae dolor non earum optio sit placeat inventore nam veniam corporis qui iusto officiis. Nam maxime dolorem ut repellat rerum ut quis sunt in quia autem ut debitis delectus At tempore magnam. Ut quia consequatur est perferendis veritatis et voluptas earum et deserunt odit ut consequatur dolorem et error debitis. Et neque facilis id quidem doloremque ut nulla explicabo et natus alias.', '/uploads/e5e445d75ba4cc763dd4fb8d02802ef5');

-- --------------------------------------------------------

--
-- Table structure for table `policies`
--

CREATE TABLE `policies` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `policy_detail` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `policies`
--

INSERT INTO `policies` (`id`, `candidate_id`, `policy_detail`) VALUES
(0, 0, 'saadfs'),
(0, 0, 'zddsfe'),
(0, 0, 'ca'),
(0, 1, 'aweaf'),
(0, 1, 'zsczd'),
(0, 1, 'sd'),
(0, 1, 'sgsdgd'),
(0, 1, 'zfdgdr'),
(0, 1, 'dgrrdrh'),
(0, 4, 'xzxzxz'),
(0, 4, 'sdsd'),
(0, 5, 'ddsa'),
(0, 5, 'adasd'),
(0, 5, 'dadsd'),
(0, 6, 'cvfffv'),
(0, 6, 'fvf'),
(0, 6, 'vff'),
(0, 7, 'adasd'),
(0, 7, 'xa'),
(0, 8, 'dsd'),
(0, 8, 'dvsd'),
(0, 8, 'vdsvsd'),
(0, 9, 'sadasd'),
(0, 9, 'dsdas'),
(0, 9, 'asasd'),
(0, 1, 'xX'),
(0, 1, 'xXz'),
(0, 9, 'dqwdq'),
(0, 9, 'ddqwdwq'),
(0, 9, 'qddwd'),
(0, 10, 'xx'),
(0, 10, 'xsx'),
(0, 10, 'xxs'),
(0, 12, 'zdc'),
(0, 12, 'cds'),
(0, 12, 'cs'),
(0, 13, 'nothing'),
(0, 13, 'nothing'),
(0, 13, 'nothing'),
(0, 14, 'nothing'),
(0, 14, 'nothing'),
(0, 14, 'nothing'),
(0, 15, '1'),
(0, 15, '2'),
(0, 15, '3'),
(0, 16, '3'),
(0, 16, '2'),
(0, 16, '1'),
(0, 17, 'fdfd'),
(0, 17, 'fdfdf'),
(0, 17, 'fee'),
(0, 20, 'uu'),
(0, 20, 'uu'),
(0, 20, 'uu'),
(0, 21, 'ewre'),
(0, 21, 'er'),
(0, 21, 'erte'),
(0, 24, 'etrte'),
(0, 24, 'reter'),
(0, 24, 'te'),
(0, 25, 'edwe'),
(0, 25, 'ewd'),
(0, 25, 'ewdw'),
(0, 26, 'serew'),
(0, 26, 'erew'),
(0, 26, 'werwe'),
(0, 27, 'o8'),
(0, 27, 'ui'),
(0, 27, 'ui'),
(0, 28, 'xa'),
(0, 28, 'ax'),
(0, 28, 'xa'),
(0, 29, 'fdf'),
(0, 29, 'fddf'),
(0, 29, 'fddf'),
(0, 30, 'df'),
(0, 30, 'd'),
(0, 30, 'df'),
(0, 31, 'rt'),
(0, 31, 'tr'),
(0, 31, 'rt'),
(0, 32, 'tr'),
(0, 32, 'trt'),
(0, 32, 'r'),
(0, 33, 'fdsf'),
(0, 33, 'sdds'),
(0, 33, 'dssd'),
(0, 34, 'lll'),
(0, 34, 'lll'),
(0, 34, 'lll'),
(0, 36, 'ggg'),
(0, 36, 'ggg'),
(0, 36, 'ggg'),
(0, 37, 'h'),
(0, 37, 'h'),
(0, 37, 'h'),
(0, 38, 'h'),
(0, 38, 'hh'),
(0, 38, 'h'),
(0, 38, 'h'),
(0, 39, 'd'),
(0, 39, 'd'),
(0, 39, 'd'),
(0, 40, 'c'),
(0, 40, 'c'),
(0, 40, 'c'),
(0, 41, 'zz'),
(0, 41, 'z'),
(0, 41, 'z'),
(0, 42, 'zx'),
(0, 42, 'zx'),
(0, 42, 'zx'),
(0, 45, 'w'),
(0, 45, 'sa'),
(0, 45, 'sa'),
(0, 47, 'good'),
(0, 47, 'double good'),
(0, 47, 'triple good'),
(0, 48, 'ยอดเยี่ยม'),
(0, 48, 'จริงใจ'),
(0, 48, 'ที่สุด'),
(0, 49, 'rtt'),
(0, 49, 'ryy'),
(0, 49, 'rrr'),
(0, 50, 'df'),
(0, 50, 'ssd'),
(0, 50, 'sdds'),
(0, 51, 'erde'),
(0, 51, 'sefre'),
(0, 51, 'free'),
(0, 52, 'y'),
(0, 52, 'ty'),
(0, 52, 'yt'),
(0, 53, 'tyg'),
(0, 53, 'ghg'),
(0, 53, 'ghhg'),
(0, 54, 'ee'),
(0, 54, 'ee'),
(0, 54, 'ee');

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `id` int(11) NOT NULL,
  `school_code` varchar(20) NOT NULL,
  `school_name` varchar(255) NOT NULL,
  `school_color` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`id`, `school_code`, `school_name`, `school_color`) VALUES
(1, 'school1', 'School of Agro-Industry', '#fa9ecc'),
(2, 'school2', 'School of Applied Digital Technology', '#150859'),
(3, 'school3', 'School of Cosmetic Science', '#eb018b'),
(4, 'school4', 'School of Dentistry', '#642c8e'),
(5, 'school5', 'School of Health Science', '#4aa748'),
(6, 'school6', 'School of Integrative Medicine', '#07b9cc'),
(7, 'school7', 'School of Law', '#ffffff'),
(8, 'school8', 'School of Liberal Arts', '#4b5159'),
(9, 'school9', 'School of Management', '#05afec'),
(10, 'school10', 'School of Medicine', '#126434'),
(11, 'school11', 'School of Nursing', '#f65623'),
(12, 'school12', 'School of Science', '#fff004'),
(13, 'school13', 'School of Sinology', '#f11b22'),
(14, 'school14', 'School of Social Innovation', '#fdeeb1');

-- --------------------------------------------------------

--
-- Table structure for table `school_codes`
--

CREATE TABLE `school_codes` (
  `id` int(11) NOT NULL,
  `school_id` int(11) DEFAULT NULL,
  `school_code` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_codes`
--

INSERT INTO `school_codes` (`id`, `school_id`, `school_code`) VALUES
(1, 1, '14'),
(2, 2, '13'),
(3, 2, '15'),
(4, 3, '17'),
(5, 4, '22'),
(6, 5, '18'),
(7, 6, '25'),
(8, 7, '16'),
(9, 8, '10'),
(10, 9, '12'),
(11, 10, '21'),
(12, 11, '19'),
(13, 12, '11'),
(14, 13, '24'),
(15, 14, '23');

-- --------------------------------------------------------

--
-- Table structure for table `school_majors`
--

CREATE TABLE `school_majors` (
  `id` int(11) NOT NULL,
  `school_id` int(11) DEFAULT NULL,
  `major_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `school_majors`
--

INSERT INTO `school_majors` (`id`, `school_id`, `major_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 2, 4),
(5, 2, 5),
(6, 2, 6),
(7, 2, 7),
(8, 3, 8),
(9, 3, 9),
(10, 4, 10),
(11, 5, 11),
(12, 5, 12),
(13, 5, 13),
(14, 5, 13),
(15, 6, 14),
(16, 6, 15),
(17, 6, 16),
(18, 7, 17),
(19, 7, 18),
(20, 8, 19),
(21, 8, 20),
(22, 9, 21),
(23, 9, 22),
(24, 9, 23),
(25, 10, 24),
(26, 11, 25),
(27, 12, 26),
(28, 12, 27),
(29, 12, 28),
(30, 13, 29),
(31, 13, 30),
(32, 13, 31),
(33, 13, 32),
(34, 14, 33);

-- --------------------------------------------------------

--
-- Table structure for table `setter`
--

CREATE TABLE `setter` (
  `id` int(11) NOT NULL,
  `event_type` enum('President of the Student Union Candidate Register','Student Council Member (School of) Register','Student Council Member (Normal) Register','President of the Student Union Candidate Information','Student Council Member (School of) Information','Student Council Member (Normal) Information','President of Student Association Information','President of the Student Union Candidate Vote','Student Council Member (School of) Vote','Student Council Member (Normal) Vote','President of Student Association Vote','President of the Student Union Candidate Result','Student Council Member (School of) Result','Student Council Member (Normal) Result','President of Student Association Result') NOT NULL,
  `start_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_date` date NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `setter`
--

INSERT INTO `setter` (`id`, `event_type`, `start_date`, `start_time`, `end_date`, `end_time`) VALUES
(70, 'President of the Student Union Candidate Register', '2025-05-26', '11:56:00', '2025-05-29', '11:57:00'),
(71, 'President of the Student Union Candidate Information', '2025-05-26', '11:57:00', '2025-05-28', '11:57:00'),
(72, 'President of the Student Union Candidate Vote', '2025-05-26', '11:57:00', '2025-05-28', '11:57:00'),
(73, 'President of the Student Union Candidate Result', '2025-05-26', '11:57:00', '2025-05-28', '11:57:00'),
(74, '', '2025-05-26', '12:08:00', '2025-05-28', '12:08:00'),
(75, '', '2025-05-26', '12:08:00', '2025-05-28', '12:08:00'),
(76, '', '2025-05-26', '12:08:00', '2025-05-28', '12:08:00'),
(77, '', '2025-05-26', '12:09:00', '2025-05-28', '12:09:00'),
(78, 'Student Council Member (Normal) Register', '2025-05-26', '12:21:00', '2025-05-28', '12:21:00'),
(79, 'Student Council Member (Normal) Information', '2025-05-26', '12:21:00', '2025-05-28', '12:21:00'),
(80, 'Student Council Member (Normal) Vote', '2025-05-26', '12:21:00', '2025-05-28', '12:21:00'),
(81, 'Student Council Member (Normal) Result', '2025-05-29', '17:28:00', '2025-05-30', '17:29:00'),
(82, 'President of Student Association Information', '2025-05-26', '12:27:00', '2025-05-28', '12:27:00'),
(83, 'President of Student Association Vote', '2025-05-26', '12:28:00', '2025-05-28', '12:28:00'),
(84, 'President of Student Association Result', '2025-05-26', '12:28:00', '2025-05-28', '12:28:00'),
(85, '', '2025-05-29', '17:18:00', '2025-05-30', '17:18:00'),
(86, '', '2025-05-29', '17:21:00', '2025-05-30', '17:21:00'),
(87, 'Student Council Member (School of) Register', '2025-05-29', '17:22:00', '2025-05-30', '17:22:00'),
(88, 'Student Council Member (School of) Information', '2025-05-29', '17:23:00', '2025-05-30', '17:23:00'),
(89, 'Student Council Member (School of) Vote', '2025-05-29', '17:28:00', '2025-05-30', '17:28:00'),
(90, 'Student Council Member (School of) Result', '2025-05-29', '17:29:00', '2025-05-31', '17:29:00');

-- --------------------------------------------------------

--
-- Table structure for table `slides`
--

CREATE TABLE `slides` (
  `id` int(11) NOT NULL,
  `textDetail` varchar(255) NOT NULL,
  `linkDetail` varchar(255) DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `slides`
--

INSERT INTO `slides` (`id`, `textDetail`, `linkDetail`, `imagePath`) VALUES
(1, 'dee', 'http://localhost:3000/public/PDPA_president.html', '/uploads/4cd9bf7bf2b96bd0773ef6f6e23e0d48'),
(2, 'Election Results of Student Council', 'https://www.facebook.com/', '/uploads/04b09ff9622ae76207c50ac04adddc77'),
(3, 'Election Results of Student Union President', 'https://www.facebook.com/', '/uploads/d1b0ef6269f6c02c520ecc6a768f54c6');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','committee') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `username`, `password`, `role`) VALUES
(23, 'ff', '$2b$10$MpbwfcrIuTg7IVLYPM5HguTkmuox975VKE9aF8J1Ky8v4OHYxYjU6', 'admin'),
(24, 'dd', '$2b$10$RdNZhlTven6oX2RcBBgQiOLSEvy/J33HxjT0y5FSl5gz48D.P7LlS', 'committee'),
(26, 'admin', '$2b$10$SZhkeJ/7/NohVN6blMyYqu8jsdYgGTipputgAuYflRyhs9shU93yK', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `uploaded_images`
--

CREATE TABLE `uploaded_images` (
  `id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `header_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `uploaded_images`
--

INSERT INTO `uploaded_images` (`id`, `file_path`, `header_id`) VALUES
(6, '/uploads/cfa9d3d46e2684fd6210f4db00349d3d', 2),
(28, '/uploads/24b1b561b2efdebc6edc2c88e3953359', 3),
(29, '/uploads/adbd0a0340df8fc5ac8ab851c489ca9f', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `studentID` varchar(50) NOT NULL,
  `role` enum('user','candidate') NOT NULL DEFAULT 'user',
  `major_id` int(11) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `studentID`, `role`, `major_id`, `school_id`) VALUES
(22, 'NATDHANAI SUKSAWAN', '6331601052@lamduan.mfu.ac.th', '6331601052', 'user', NULL, 7),
(25, 'TIPAKORN CHAIPANYA', '6431901013@lamduan.mfu.ac.th', '6431901013', 'user', NULL, 11),
(27, 'PIMNARA MOKARAT', '6531501091@lamduan.mfu.ac.th', '6531501091', 'candidate', NULL, 2),
(29, 'PHICHAYATHIDA PINGKUL', '6531501090@lamduan.mfu.ac.th', '6531501090', 'candidate', NULL, 2),
(30, 'PHATTHARAJIN JOYJAROEN', '6531501098@lamduan.mfu.ac.th', '6531501098', 'candidate', NULL, 2),
(31, 'BOONNISA TANGJITPERMKWAMDEE', '6531501073@lamduan.mfu.ac.th', '6531501073', 'candidate', NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `candidate_id` int(11) DEFAULT NULL,
  `candidate_type` enum('President of the Student Union Candidate','Student council member (School of study)','Student council member (Normal)','President of the Faculty Student Council') NOT NULL,
  `is_abstention` tinyint(1) NOT NULL DEFAULT 0,
  `vote_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `student_id`, `candidate_id`, `candidate_type`, `is_abstention`, `vote_time`) VALUES
(103, '6531501098', NULL, 'Student council member (Normal)', 0, '2025-05-26 05:23:18'),
(104, '6531501098', 50, 'Student council member (Normal)', 0, '2025-05-26 05:23:18'),
(105, '6531501090', NULL, 'Student council member (Normal)', 0, '2025-05-26 05:23:25'),
(106, '6531501090', 51, 'Student council member (Normal)', 0, '2025-05-26 05:23:25'),
(107, '6531501073', NULL, 'Student council member (Normal)', 1, '2025-05-26 05:23:33'),
(108, '6531501091', NULL, 'Student council member (Normal)', 0, '2025-05-26 05:23:40'),
(109, '6531501091', 50, 'Student council member (Normal)', 0, '2025-05-26 05:23:40'),
(110, '6531501091', 51, 'Student council member (School of study)', 0, '2025-05-26 05:23:40'),
(111, '6331601052', 52, 'President of the Faculty Student Council', 0, '2025-05-26 05:33:49'),
(112, '6531501090', 52, 'President of the Faculty Student Council', 0, '2025-05-26 05:34:00'),
(113, '6531501098', 54, 'President of the Student Union Candidate', 0, '2025-05-26 06:48:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `studentID` (`studentID`),
  ADD KEY `fk_candidates_school_id` (`school_id`),
  ADD KEY `fk_candidates_major_id` (`major_id`);

--
-- Indexes for table `headers`
--
ALTER TABLE `headers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `majors`
--
ALTER TABLE `majors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pdpa_content`
--
ALTER TABLE `pdpa_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `school_codes`
--
ALTER TABLE `school_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

--
-- Indexes for table `school_majors`
--
ALTER TABLE `school_majors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `major_id` (`major_id`);

--
-- Indexes for table `setter`
--
ALTER TABLE `setter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `slides`
--
ALTER TABLE `slides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `uploaded_images`
--
ALTER TABLE `uploaded_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `header_id` (`header_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `studentID` (`studentID`),
  ADD KEY `fk_users_school_id` (`school_id`),
  ADD KEY `fk_users_major_id` (`major_id`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `candidate_id` (`candidate_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `headers`
--
ALTER TABLE `headers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `majors`
--
ALTER TABLE `majors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `pdpa_content`
--
ALTER TABLE `pdpa_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `schools`
--
ALTER TABLE `schools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `school_codes`
--
ALTER TABLE `school_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `school_majors`
--
ALTER TABLE `school_majors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `setter`
--
ALTER TABLE `setter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `slides`
--
ALTER TABLE `slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `uploaded_images`
--
ALTER TABLE `uploaded_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `users` (`studentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_candidates_major_id` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_candidates_school_id` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `school_codes`
--
ALTER TABLE `school_codes`
  ADD CONSTRAINT `school_codes_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`);

--
-- Constraints for table `school_majors`
--
ALTER TABLE `school_majors`
  ADD CONSTRAINT `school_majors_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `school_majors_ibfk_2` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `uploaded_images`
--
ALTER TABLE `uploaded_images`
  ADD CONSTRAINT `uploaded_images_ibfk_1` FOREIGN KEY (`header_id`) REFERENCES `headers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_major_id` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_users_school_id` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
