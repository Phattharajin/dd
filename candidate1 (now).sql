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

CREATE TABLE `headers` (
  `id` int(11) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `headers` (`id`, `text`) VALUES
(1, 'President of the Student Union Candidates'),
(2, 'Student Council Member (school of study)'),
(3, 'Student Council Member (Normal)');

CREATE TABLE `majors` (
  `id` int(11) NOT NULL,
  `major_code` varchar(20) NOT NULL,
  `major_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

CREATE TABLE `pdpa_content` (
  `id` int(11) NOT NULL,
  `header_text` text DEFAULT NULL,
  `radio_label` text DEFAULT NULL,
  `swal_message` text DEFAULT NULL,
  `image_path` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `pdpa_content` (`id`, `header_text`, `radio_label`, `swal_message`, `image_path`) VALUES
(1, 'PDPA', 'I agree to collect personal data', 'Lorem ipsum dolor sit amet. Sed ipsa pariatur non fuga ratione et vitae dolor non earum optio sit placeat inventore nam veniam corporis qui iusto officiis. Nam maxime dolorem ut repellat rerum ut quis sunt in quia autem ut debitis delectus At tempore magnam. Ut quia consequatur est perferendis veritatis et voluptas earum et deserunt odit ut consequatur dolorem et error debitis. Et neque facilis id quidem doloremque ut nulla explicabo et natus alias.', '/uploads/e5e445d75ba4cc763dd4fb8d02802ef5');

CREATE TABLE `policies` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `policy_detail` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `schools` (
  `id` int(11) NOT NULL,
  `school_code` varchar(20) NOT NULL,
  `school_name` varchar(255) NOT NULL,
  `school_color` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

CREATE TABLE `school_codes` (
  `id` int(11) NOT NULL,
  `school_id` int(11) DEFAULT NULL,
  `school_code` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `school_majors` (
  `id` int(11) NOT NULL,
  `school_id` int(11) DEFAULT NULL,
  `major_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

CREATE TABLE `setter` (
  `id` int(11) NOT NULL,
  `event_type` enum('President of the Student Union Candidate Register','Student Council Member (School of) Register','Student Council Member (Normal) Register','President of the Student Union Candidate Information','Student Council Member (School of) Information','Student Council Member (Normal) Information','President of Student Association Information','President of the Student Union Candidate Vote','Student Council Member (School of) Vote','Student Council Member (Normal) Vote','President of Student Association Vote','President of the Student Union Candidate Result','Student Council Member (School of) Result','Student Council Member (Normal) Result','President of Student Association Result') NOT NULL,
  `start_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_date` date NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `slides` (
  `id` int(11) NOT NULL,
  `textDetail` varchar(255) NOT NULL,
  `linkDetail` varchar(255) DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `slides` (`id`, `textDetail`, `linkDetail`, `imagePath`) VALUES
(1, 'dee', 'http://localhost:3000/public/PDPA_president.html', '/uploads/4cd9bf7bf2b96bd0773ef6f6e23e0d48'),
(2, 'Election Results of Student Council', 'https://www.facebook.com/', '/uploads/04b09ff9622ae76207c50ac04adddc77'),
(3, 'Election Results of Student Union President', 'https://www.facebook.com/', '/uploads/d1b0ef6269f6c02c520ecc6a768f54c6');

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','committee') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `staff` (`id`, `username`, `password`, `role`) VALUES
(23, 'ff', '$2b$10$MpbwfcrIuTg7IVLYPM5HguTkmuox975VKE9aF8J1Ky8v4OHYxYjU6', 'admin'),
(26, 'admin', '$2b$10$SZhkeJ/7/NohVN6blMyYqu8jsdYgGTipputgAuYflRyhs9shU93yK', 'admin');

CREATE TABLE `uploaded_images` (
  `id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `header_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `uploaded_images` (`id`, `file_path`, `header_id`) VALUES
(6, '/uploads/cfa9d3d46e2684fd6210f4db00349d3d', 2),
(28, '/uploads/24b1b561b2efdebc6edc2c88e3953359', 3),
(29, '/uploads/adbd0a0340df8fc5ac8ab851c489ca9f', 1);


CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `studentID` varchar(50) NOT NULL,
  `role` enum('user','candidate') NOT NULL DEFAULT 'user',
  `major_id` int(11) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `candidate_id` int(11) DEFAULT NULL,
  `candidate_type` enum('President of the Student Union Candidate','Student council member (School of study)','Student council member (Normal)','President of the Faculty Student Council') NOT NULL,
  `is_abstention` tinyint(1) NOT NULL DEFAULT 0,
  `vote_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `studentID` (`studentID`),
  ADD KEY `fk_candidates_school_id` (`school_id`),
  ADD KEY `fk_candidates_major_id` (`major_id`);

ALTER TABLE `headers`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `majors`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `pdpa_content`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `schools`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `school_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`);

ALTER TABLE `school_majors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `school_id` (`school_id`),
  ADD KEY `major_id` (`major_id`);

ALTER TABLE `setter`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `slides`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

ALTER TABLE `uploaded_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `header_id` (`header_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `studentID` (`studentID`),
  ADD KEY `fk_users_school_id` (`school_id`),
  ADD KEY `fk_users_major_id` (`major_id`);

ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `candidate_id` (`candidate_id`);

ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

ALTER TABLE `headers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `majors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

ALTER TABLE `pdpa_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `schools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

ALTER TABLE `school_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `school_majors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

ALTER TABLE `setter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

ALTER TABLE `slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

ALTER TABLE `uploaded_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;


ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `users` (`studentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_candidates_major_id` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_candidates_school_id` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL;

ALTER TABLE `school_codes`
  ADD CONSTRAINT `school_codes_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`);

ALTER TABLE `school_majors`
  ADD CONSTRAINT `school_majors_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `school_majors_ibfk_2` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE CASCADE;

ALTER TABLE `uploaded_images`
  ADD CONSTRAINT `uploaded_images_ibfk_1` FOREIGN KEY (`header_id`) REFERENCES `headers` (`id`) ON DELETE CASCADE;

ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_major_id` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_users_school_id` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL;

ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE SET NULL;
COMMIT;
