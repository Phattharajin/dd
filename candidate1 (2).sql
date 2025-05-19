-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2025 at 09:18 AM
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
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `name`, `studentID`, `school_id`, `major_id`, `line_id`, `gpax`, `gpax_level`, `candidate_type`, `picture_url`, `transcript_url`, `policy_poster_url`, `status`) VALUES
(39, 'sdfdfddsds', '6331601052', 1, 1, 'sdfssffs', 3.26, 'Bachelor transcript', 'President of the Student Union Candidate', 'uploads\\8555960f9405db5e761055e3578951d8', 'uploads\\f10e2626422c69c3bdff8d329e44258c', 'uploads\\38ff20bc1b2498d1721fccdf000051fb', 'Approved'),
(40, 'EUGENE', '6531501098', 8, 21, 'sdfssffs', 3.26, 'High school transcript(1st year only)', 'President of the Student Union Candidate', 'uploads\\3ab613d863b53b0e9fb44c5e83d3679c', 'uploads\\afb69cb6d5c390908ebfbe8b693ab5d0', 'uploads\\e16e0fdce23ed99b312323042bc574c0', 'Approved');

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
(1, 'PDPA', 'I agree to collect personal data', 'Lorem ipsum dolor sit amet. Sed ipsa pariatur non fuga ratione et vitae dolor non earum optio sit placeat inventore nam veniam corporis qui iusto officiis. Nam maxime dolorem ut repellat rerum ut quis sunt in quia autem ut debitis delectus At tempore magnam. Ut quia consequatur est perferendis veritatis et voluptas earum et deserunt odit ut consequatur dolorem et error debitis. Et neque facilis id quidem doloremque ut nulla explicabo et natus alias.', '/uploads/e7c88e1c207acaf86bd545e167d93131');

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
(0, 40, 'c');

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
  `event_type` enum('President of the Student Union Candidate Register','Student Council Member (School of Study) Register','Student Council Member (Normal) Register','President of the Student Union Candidate Information','Student Council Member (School of Study) Information','Student Council Member (Normal) Information','President of Student Association Information','President of the Student Union Candidate Vote','Student Council Member (School of Study) Vote','Student Council Member (Normal) Vote','President of Student Association Vote') NOT NULL,
  `start_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_date` date NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `setter`
--

INSERT INTO `setter` (`id`, `event_type`, `start_date`, `start_time`, `end_date`, `end_time`) VALUES
(21, 'Student Council Member (Normal) Register', '2025-04-26', '18:23:00', '2025-04-30', '18:24:00'),
(29, 'Student Council Member (Normal) Vote', '2025-04-26', '21:18:00', '2025-04-29', '21:17:00'),
(30, '', '2025-04-26', '21:23:00', '2025-04-30', '21:22:00'),
(31, '', '2025-04-26', '22:40:00', '2025-05-01', '22:41:00'),
(32, '', '2025-05-14', '14:46:00', '2025-05-22', '14:47:00'),
(33, '', '2025-05-14', '14:47:00', '2025-05-22', '14:48:00'),
(34, 'President of the Student Union Candidate Register', '2025-05-14', '14:51:00', '2025-05-23', '02:51:00'),
(35, 'President of Student Association Vote', '2025-05-15', '15:08:00', '2025-05-31', '15:09:00'),
(36, 'President of Student Association Information', '2025-05-15', '15:10:00', '2025-05-17', '15:11:00');

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
(1, 'dee', 'http://localhost:3000/view/user/PDPA_president.html', '/uploads/108ee5824d16a3a21f6366d4a66c93ae'),
(2, 'Election Results of Student Council', 'https://www.facebook.com/', '/uploads/33671a2aa4babf0c4f084d9f535de4c0'),
(3, 'Election Results of Student Union President', 'https://www.facebook.com/', '/uploads/d1b0ef6269f6c02c520ecc6a768f54c6');

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
(6, '/uploads/3a9a955d7c087fbabce8c58d12b9404f', 2),
(28, '/uploads/342e3f7fa02b3a731ebf5cb81cc2d535', 3),
(29, '/uploads/0277104756366f7fbcfdf64bec48cb45', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `studentID` varchar(50) NOT NULL,
  `role` enum('admin','user','candidate','committee') NOT NULL DEFAULT 'user',
  `major_id` int(11) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `studentID`, `role`, `major_id`, `school_id`) VALUES
(7, 'PHICHAYATHIDA PINGKUL', '6531501090@lamduan.mfu.ac.th', '6531501090', 'admin', NULL, NULL),
(11, 'BOONNISA TANGJITPERMKWAMDEE', '6531501073@lamduan.mfu.ac.th', '6531501073', 'committee', NULL, NULL),
(13, 'PHATTHARAJIN JOYJAROEN', '6531501098@lamduan.mfu.ac.th', '6531501098', 'admin', NULL, NULL),
(14, 'PIMNARA MOKARAT', '6531501091@lamduan.mfu.ac.th', '6531501091', 'user', NULL, NULL),
(15, 'NATDHANAI SUKSAWAN', '6331601052@lamduan.mfu.ac.th', '6331601052', 'committee', NULL, NULL);

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
(84, '6531501098', 39, 'President of the Student Union Candidate', 0, '2025-04-26 15:10:55'),
(85, '6531501073', 40, 'President of the Student Union Candidate', 0, '2025-04-26 15:11:11');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `slides`
--
ALTER TABLE `slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `uploaded_images`
--
ALTER TABLE `uploaded_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

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
