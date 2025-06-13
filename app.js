const express = require('express');
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require("cors");
const fileUpload = require('express-fileupload');
const router = express.Router();

app.use(cors());

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, 'uploads')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connect to the database.');
});

//app.use("/public", express.static("D:/candidate/public"));


app.get("/home", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'home.html'));
});


app.get("/admin_home", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'admin_home.html'));
});

app.get("/committee_home", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'committee_home.html'));
});

app.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'login.html'));
});

app.get("/loginstaff", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'loginstaff.html'));
});

app.get("/add_staff", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'add_staff.html'));
});

app.get("/change_password", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'change_password.html'));
});

app.use(express.json());
app.use(
    session({
        secret: "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",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;

            // Accept only lamduan and mfu domains
            if (!email.endsWith("@lamduan.mfu.ac.th") && !email.endsWith("@mfu.ac.th")) {
                return done(null, false, { message: "Only @lamduan.mfu.ac.th or @mfu.ac.th emails are allowed!" });
            }

            let name, studentID = null, role = "user", major_id = null, school_id = null;

            if (email.endsWith("@lamduan.mfu.ac.th")) {
                studentID = email.split("@")[0];
                name = profile.displayName;

                const schoolCode = studentID.substring(3, 5); // 4th and 5th characters

                // Query school_id from school_codes table
                db.query("SELECT school_id FROM school_codes WHERE school_code = ?", [schoolCode], (err, schoolResults) => {
                    if (err) return done(err);

                    if (schoolResults.length > 0) {
                        school_id = schoolResults[0].school_id;
                    }

                    // Continue with user check or insert
                    handleUserCreation();
                });
            } else if (email.endsWith("@mfu.ac.th")) {
                // Only set name, no studentID/school_id
                name = email.split("@")[0];
                handleUserCreation();
            }

            function handleUserCreation() {
                db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
                    if (err) return done(err);

                    if (results.length > 0) {
                        return done(null, results[0]); // User already exists
                    } else {
                        const newUser = {
                            name,
                            email,
                            studentID,
                            role,
                            major_id,
                            school_id,
                        };

                        db.query("INSERT INTO users SET ?", newUser, (err, insertResult) => {
                            if (err) return done(err);
                            newUser.id = insertResult.insertId;
                            return done(null, newUser);
                        });
                    }
                });
            }
        }
    )
);
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login?error=invalid_email" }),
    (req, res) => {
        db.query("SELECT role FROM users WHERE email = ?", [req.user.email], (err, results) => {
            if (err) return res.redirect("/login?error=db_error");

            if (results.length === 0) {
                return res.redirect("/login?error=user_not_found");
            }

            const userRole = results[0].role;
            let redirectUrl = "/home";

            res.redirect(`${redirectUrl}?user=${encodeURIComponent(req.user.displayName)}`);
        });
    }
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});


// Google OAuth Login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect(`/home?user=${encodeURIComponent(req.user.displayName)}`);
    }
);

// Logout Route
app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/login");
    });
});

app.get("/user-info", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch role from the database
    db.query("SELECT name, email, studentID, role FROM users WHERE email = ?", [req.user.email], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const { name, email, studentID, role } = results[0];

        res.json({ name, studentID, email, role });
    });
});

app.get('/user-school', (req, res) => {
    const studentID = req.query.studentID;

    const query = `
      SELECT u.studentID, s.school_name
      FROM users u
      JOIN school_codes sc ON SUBSTRING(u.studentID, 4, 2) = sc.school_code
      JOIN schools s ON sc.school_id = s.id
      WHERE u.studentID = ?
    `;

    db.execute(query, [studentID], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "School not found for the given student ID" });
        }

        res.json(results[0]);
    });
});


app.get('/faculty', (req, res) => {
    const studentID = req.user.studentID;

    const query = `
      SELECT s.school_color, sc.school_code
      FROM users u
      JOIN school_codes sc ON SUBSTRING(u.studentID, 4, 2) = sc.school_code
      JOIN schools s ON sc.school_id = s.id
      WHERE u.studentID = ?
    `;

    db.execute(query, [studentID], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "School not found for the given student ID" });
        }

        const { school_color, school_code } = results[0];
        res.json({ schoolColor: school_color, schoolCode: school_code });
    });
});

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'upload')));
app.use('/uploads', express.static('uploads'));

app.post('/uploads', upload.single('file'), (req, res) => {
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl });
});


app.post("/update-slide/:id", upload.single("image"), (req, res) => {
    const { id } = req.params;
    const textDetail = req.body.textDetail;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let sql = "UPDATE slides SET textDetail = ?";
    let values = [textDetail];

    if (req.file) {
        sql += ", imagePath = ?";
        values.push(imagePath);
    }

    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err
            });
        }

        res.json({
            success: true,
            message: "Slide updated successfully",
            imagePath: imagePath || ""
        });
    });
});

app.get('/get-slides', (req, res) => {
    const sql = 'SELECT textDetail, imagePath FROM slides';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Slides fetched from database:", results);
        res.json(results);
    });
});

async function fetchSlides() {
    try {
        const response = await fetch('http://localhost:3000/get-slides');
        slides = await response.json();
        console.log(slides);
        renderSlides();
    } catch (error) {
        console.error('Error fetching slides:', error);
    }
}

app.get("/register_president", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'register_president.html'));
});

app.get("/register_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'register_council_school.html'));
});

app.get("/register_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'register_council_normal.html'));
});

app.post("/register-candidate", upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "policy_poster", maxCount: 1 }
]), (req, res) => {
    const { name, studentID, school_id, major_id, line_id, gpax, gpax_level, candidate_type } = req.body;
    const picture_url = req.files["picture"] ? req.files["picture"][0].path : null;
    const transcript_url = req.files["transcript"] ? req.files["transcript"][0].path : null;
    const policy_poster_url = req.files["policy_poster"] ? req.files["policy_poster"][0].path : null;

    const sql = `
        INSERT INTO candidates (name, studentID, school_id, major_id, line_id, gpax, gpax_level, candidate_type, picture_url, transcript_url, policy_poster_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [name, studentID, school_id, major_id, line_id, gpax, gpax_level, candidate_type, picture_url, transcript_url, policy_poster_url],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error while registering candidate" });
            }
            res.json({ message: "Candidate registered successfully!", candidate_id: result.insertId });
        }
    );
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File size exceeds 50 MB limit" });
    }
    next(err);
});

app.post("/submit-policy", (req, res) => {
    const { candidate_id, policy_detail } = req.body;

    const sql = `INSERT INTO policies (candidate_id, policy_detail) VALUES (?, ?)`;
    db.query(sql, [candidate_id, policy_detail], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error while submitting policy" });
        }
        res.json({ message: "Policy submitted successfully!", policy_id: result.insertId });
    });
});


// Get all schools
app.get('/schools', (req, res) => {
    const query = "SELECT * FROM schools";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ error: "Database query failed" });
            return;
        }
        res.json(results);
    });
});

app.get('/majors/:schoolId', (req, res) => {
    const schoolId = req.params.schoolId;
    const query = `SELECT * FROM majors 
                   INNER JOIN school_majors ON majors.id = school_majors.major_id
                   WHERE school_majors.school_id = ?`;
    db.query(query, [schoolId], (err, results) => {
        if (err) {
            res.status(500).send({ error: "Database query failed" });
            return;
        }
        res.json(results);
    });
});


// Get all majors
app.get("/majors", (req, res) => {
    db.query("SELECT * FROM majors", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error while fetching majors" });
        res.json(results);
    });
});


// Route to add a candidate
app.post('/candidates', async (req, res) => {
    const { name, studentID, school_id, major_id, line_id, gpax, gpax_level, candidate_type, picture_url, transcript_url, policy_poster_url } = req.body;

    try {
        // SQL to insert candidate data
        const result = await db.query(
            `INSERT INTO candidates (name, studentID, school_id, major_id, line_id, gpax, gpax_level, candidate_type, picture_url, transcript_url, policy_poster_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [name, studentID, school_id, major_id, line_id, gpax, gpax_level, candidate_type, picture_url, transcript_url, policy_poster_url]
        );
        res.status(201).json({ message: "Candidate added successfully!" });
    } catch (error) {
        console.error("Error adding candidate:", error);
        res.status(500).send("Server Error");
    }
});

app.get("/PDPA_president", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'PDPA_president.html'));
});

app.get("/condition_president", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'condition_president.html'));
});

app.get("/PDPA_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'PDPA_council_school.html'));
});

app.get("/condition_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'condition_council_school.html'));
});

app.get("/PDPA_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'PDPA_council_normal.html'));
});

app.get("/condition_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'condition_council_normal.html'));
});

app.get('/api/header-image/:headerId', (req, res) => {
    const headerId = req.params.headerId;

    const sql = `
      SELECT h.text AS header_text, ui.file_path
      FROM headers h
      LEFT JOIN uploaded_images ui ON h.id = ui.header_id
      WHERE h.id = ?
    `;

    db.query(sql, [headerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Not found' });

        res.json({
            header_text: results[0].header_text,
            images: results
                .filter(row => row.file_path) // กัน null ถ้าไม่มีรูป
                .map(row => '/uploads/' + row.file_path.split('/').pop()) // ดึงเฉพาะชื่อไฟล์
        });
    });
});
app.get("/information_president_student", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'information_president_student.html'));
});

app.get("/information_council_school", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'information_council_school.html'));
});

app.get("/information_council_normal", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'information_council_normal.html'));
});

app.get("/information_president_faculty", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'information_president_faculty.html'));
});


//--------------vote-----------
router.post('/api/vote', async (req, res) => {
    const { studentId, candidateId, isAbstention } = req.body;

    // If abstaining, candidateId will be null
    const voteData = {
        student_id: studentId,
        candidate_id: isAbstention ? null : candidateId,
        is_abstention: isAbstention ? 1 : 0,
        vote_time: new Date(),
    };

    try {
        // Insert the vote into the database
        await db.query('INSERT INTO votes SET ?', voteData);
        res.status(201).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ message: 'Error recording vote' });
    }
});
app.use(router);

// Fetch image by candidate_id (when a user votes for a candidate)
app.get('/api/vote-picture', (req, res) => {
    // Query ดึง candidate id จาก vote table โดยใช้ vote ล่าสุด (อาจปรับเงื่อนไขได้)
    const query = `
      SELECT c.picture_url 
      FROM votes v 
      JOIN candidates c ON v.candidate_id = c.id 
      ORDER BY v.vote_time DESC 
      LIMIT 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('SQL error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No vote found' });
        }

        let pictureUrl = results[0].picture_url;
        pictureUrl = pictureUrl.replace(/\\/g, '/');

        const absolutePath = path.join(__dirname, pictureUrl);

        fs.readFile(absolutePath, (err, data) => {
            if (err) {
                console.error('File read error:', err);
                return res.status(500).json({ error: 'Error reading file' });
            }

            const ext = path.extname(absolutePath).toLowerCase();
            let mimeType = 'image/jpeg';
            if (ext === '.png') {
                mimeType = 'image/png';
            } else if (ext === '.gif') {
                mimeType = 'image/gif';
            }

            // แปลงข้อมูลไฟล์เป็น Base64 แล้วสร้าง Data URI
            const base64Data = data.toString('base64');
            const dataUri = `data:${mimeType};base64,${base64Data}`;

            // ส่ง Data URI กลับไปให้ frontend
            res.json({ imageData: dataUri });
        });
    });
});

app.get("/vote_president_student", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'vote_president_student.html'));
});

app.get("/vote_council_school", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'vote_council_school.html'));
});

app.get("/vote_council_normal", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'vote_council_normal.html'));
});

app.get("/vote_president_faculty", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'vote_president_faculty.html'));
});


router.post('/api/vote', async (req, res) => {
    const { studentId, candidateId, isAbstention } = req.body;

    // If abstaining, candidateId will be null
    const voteData = {
        student_id: studentId,
        candidate_id: isAbstention ? null : candidateId,
        is_abstention: isAbstention ? 1 : 0,
        vote_time: new Date(),
    };

    try {
        // Insert the vote into the database
        await db.query('INSERT INTO votes SET ?', voteData);
        res.status(201).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ message: 'Error recording vote' });
    }
});
app.use(router);

// Fetch image by candidate_id (when a user votes for a candidate)
app.get('/api/vote-picture', (req, res) => {
    // Query ดึง candidate id จาก vote table โดยใช้ vote ล่าสุด (อาจปรับเงื่อนไขได้)
    const query = `
      SELECT c.picture_url 
      FROM votes v 
      JOIN candidates c ON v.candidate_id = c.id 
      ORDER BY v.vote_time DESC 
      LIMIT 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('SQL error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No vote found' });
        }

        // ได้ picture_url จาก candidates
        let pictureUrl = results[0].picture_url; // ตัวอย่าง: "uploads\82e3fbae0d564a0821d19bfa30050de5.jpg"
        // แก้ไขให้ใช้ forward slashes
        pictureUrl = pictureUrl.replace(/\\/g, '/');

        // สร้าง absolute path
        const absolutePath = path.join(__dirname, pictureUrl);

        fs.readFile(absolutePath, (err, data) => {
            if (err) {
                console.error('File read error:', err);
                return res.status(500).json({ error: 'Error reading file' });
            }

            // กำหนด mime type ตามนามสกุลไฟล์
            const ext = path.extname(absolutePath).toLowerCase();
            let mimeType = 'image/jpeg';
            if (ext === '.png') {
                mimeType = 'image/png';
            } else if (ext === '.gif') {
                mimeType = 'image/gif';
            }

            // แปลงข้อมูลไฟล์เป็น Base64 แล้วสร้าง Data URI
            const base64Data = data.toString('base64');
            const dataUri = `data:${mimeType};base64,${base64Data}`;

            // ส่ง Data URI กลับไปให้ frontend
            res.json({ imageData: dataUri });
        });
    });
});

app.post('/api/votecandidate', async (req, res) => {
    const { studentId, candidateId, isAbstention } = req.body;

    // Validate input
    if (isAbstention && candidateId !== null) {
        return res.status(400).json({ message: "Candidate ID should be null when abstaining." });
    }
    if (!isAbstention && candidateId === null) {
        return res.status(400).json({ message: "Candidate ID is required for voting." });
    }

    try {
        let candidateType = 'President of the Student Union Candidate'; // Default value for abstention

        if (!isAbstention) {
            // Fetch the candidate's type from the database
            const [candidateResult] = await db.promise().query('SELECT candidate_type FROM candidates WHERE id = ?', [candidateId]);

            if (!candidateResult.length) {
                return res.status(404).json({ message: 'Candidate not found' });
            }

            candidateType = candidateResult[0].candidate_type;
        }
        if (isAbstention) {
            if (!candidateType) {
                return res.status(400).json({ error: 'Candidate type is required for abstention.' });
            }

            // Record abstention with studentId and candidateType
            await db.query(
                'INSERT INTO votes (student_id, candidate_type, is_abstention) VALUES (?, ?, ?)',
                [studentId, candidateType, true]
            );
        }
        const [existingVote] = await db.promise().query(
            'SELECT * FROM votes WHERE student_id = ? AND candidate_type = ?',
            [studentId, candidateType]
        );

        if (existingVote.length > 0) {
            return res.status(400).json({ message: "You have already voted for this candidate type." });
        }
        const voteData = {
            student_id: studentId,
            candidate_id: isAbstention ? null : candidateId,
            candidate_type: candidateType,
            is_abstention: isAbstention ? 1 : 0,
            vote_time: new Date(),
        };

        // Insert the vote into the database
        await db.promise().query('INSERT INTO votes SET ?', voteData);
        res.status(201).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ message: 'Error recording vote' });
    }
});

//school
app.post('/api/voteschool', async (req, res) => {
    const { studentId, candidateId, isAbstention } = req.body;

    // Validate input
    if (isAbstention && candidateId !== null) {
        return res.status(400).json({ message: "Candidate ID should be null when abstaining." });
    }
    if (!isAbstention && candidateId === null) {
        return res.status(400).json({ message: "Candidate ID is required for voting." });
    }

    try {
        let candidateType = 'Student council member (School of)'; // Default value for abstention

        if (!isAbstention) {
            // Fetch the candidate's type from the database
            const [candidateResult] = await db.promise().query('SELECT candidate_type FROM candidates WHERE id = ?', [candidateId]);

            if (!candidateResult.length) {
                return res.status(404).json({ message: 'Candidate not found' });
            }

            candidateType = candidateResult[0].candidate_type;
        }
        if (isAbstention) {
            if (!candidateType) {
                return res.status(400).json({ error: 'Candidate type is required for abstention.' });
            }

            // Record abstention with studentId and candidateType
            await db.query(
                'INSERT INTO votes (student_id, candidate_type, is_abstention) VALUES (?, ?, ?)',
                [studentId, candidateType, true]
            );
        }
        const [existingVote] = await db.promise().query(
            'SELECT * FROM votes WHERE student_id = ? AND candidate_type = ?',
            [studentId, candidateType]
        );

        if (existingVote.length > 0) {
            return res.status(400).json({ message: "You have already voted for this candidate type." });
        }
        const voteData = {
            student_id: studentId,
            candidate_id: isAbstention ? null : candidateId,
            candidate_type: candidateType,
            is_abstention: isAbstention ? 1 : 0,
            vote_time: new Date(),
        };

        // Insert the vote into the database
        await db.promise().query('INSERT INTO votes SET ?', voteData);
        res.status(201).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ message: 'Error recording vote' });
    }
});

//Faculty
app.post('/api/votefaculty', async (req, res) => {
    const { studentId, candidateId, isAbstention } = req.body;

    // Validate input
    if (isAbstention && candidateId !== null) {
        return res.status(400).json({ message: "Candidate ID should be null when abstaining." });
    }
    if (!isAbstention && candidateId === null) {
        return res.status(400).json({ message: "Candidate ID is required for voting." });
    }

    try {
        let candidateType = 'President of the Faculty Student Council'; // Default value for abstention

        if (!isAbstention) {
            // Fetch the candidate's type from the database
            const [candidateResult] = await db.promise().query('SELECT candidate_type FROM candidates WHERE id = ?', [candidateId]);

            if (!candidateResult.length) {
                return res.status(404).json({ message: 'Candidate not found' });
            }

            candidateType = candidateResult[0].candidate_type;
        }
        if (isAbstention) {
            if (!candidateType) {
                return res.status(400).json({ error: 'Candidate type is required for abstention.' });
            }

            // Record abstention with studentId and candidateType
            await db.query(
                'INSERT INTO votes (student_id, candidate_type, is_abstention) VALUES (?, ?, ?)',
                [studentId, candidateType, true]
            );
        }
        const [existingVote] = await db.promise().query(
            'SELECT * FROM votes WHERE student_id = ? AND candidate_type = ?',
            [studentId, candidateType]
        );

        if (existingVote.length > 0) {
            return res.status(400).json({ message: "You have already voted for this candidate type." });
        }
        const voteData = {
            student_id: studentId,
            candidate_id: isAbstention ? null : candidateId,
            candidate_type: candidateType,
            is_abstention: isAbstention ? 1 : 0,
            vote_time: new Date(),
        };

        // Insert the vote into the database
        await db.promise().query('INSERT INTO votes SET ?', voteData);
        res.status(201).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ message: 'Error recording vote' });
    }
});


//normal
app.post('/api/votenormal', async (req, res) => {
    const { studentId, candidateIds, isAbstention, candidateType } = req.body;

    if (isAbstention && candidateIds && candidateIds.length > 0) {
        return res.status(400).json({ message: "Candidate IDs should be empty when abstaining." });
    }

    if (!isAbstention && (!candidateIds || candidateIds.length === 0)) {
        return res.status(400).json({ message: "Candidate IDs are required for voting." });
    }

    try {
        let voteType = candidateType || 'Student council member (Normal)';

        // Abstention logic
        if (isAbstention) {
            // Check for existing abstention
            const [existingAbstain] = await db.promise().query(
                'SELECT * FROM votes WHERE student_id = ? AND candidate_type = ?',
                [studentId, voteType]
            );
            if (existingAbstain.length > 0) {
                return res.status(400).json({ message: "You have already voted or abstained." });
            }

            await db.promise().query(
                'INSERT INTO votes (student_id, candidate_type, is_abstention, vote_time) VALUES (?, ?, ?, ?)',
                [studentId, voteType, true, new Date()]
            );
            return res.status(201).json({ message: 'Abstention recorded successfully' });
        }

        // Check if already voted
        const [existingVotes] = await db.promise().query(
            'SELECT * FROM votes WHERE student_id = ? AND candidate_type = ?',
            [studentId, voteType]
        );
        if (existingVotes.length > 0) {
            return res.status(400).json({ message: "You have already voted or abstained." });
        }

        // Insert each selected candidate vote
        for (const candidateId of candidateIds) {
            const [result] = await db.promise().query(
                'SELECT candidate_type FROM candidates WHERE id = ?',
                [candidateId]
            );
            if (!result.length) {
                return res.status(404).json({ message: `Candidate with ID ${candidateId} not found.` });
            }

            await db.promise().query(
                'INSERT INTO votes (student_id, candidate_id, candidate_type, is_abstention, vote_time) VALUES (?, ?, ?, ?, ?)',
                [studentId, candidateId, result[0].candidate_type, false, new Date()]
            );
        }

        res.status(201).json({ message: 'Votes recorded successfully' });
    } catch (error) {
        console.error('Error recording votes:', error);
        res.status(500).json({ message: 'Error recording votes' });
    }
});



app.get('/api/vote-status/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const candidateType = req.query.candidateType;

    try {
        if (candidateType === 'Student council member (Normal)') {
            const [voteResult] = await db.promise().query(
                'SELECT * FROM votes WHERE student_id = ? AND candidate_type = ?',
                [studentId, candidateType]
            );
            if (voteResult.length > 0) {
                return res.status(200).json({
                    hasVoted: true,
                    voteDetails: voteResult  // For Normal candidates, return all the votes (even multiple)
                });
            }
            return res.status(200).json({ hasVoted: false });
        } else {
            // Check for specific candidate type votes (e.g., 'President' or 'School Council')
            const [voteResult] = await db.promise().query(
                'SELECT * FROM votes WHERE student_id = ? AND candidate_type = ?',
                [studentId, candidateType]
            );

            if (voteResult.length > 0) {

                const vote = voteResult[0];
                if (vote.is_abstention === 1) {
                    // User has abstained
                    return res.status(200).json({
                        hasVoted: true,
                        abstained: true,  // Add abstention flag to the response
                    });
                } else {
                    // User has voted for a candidate (not abstained)
                    return res.status(200).json({
                        hasVoted: true,
                        abstained: false,  // Not abstained
                    });
                }
            } else {
                // User hasn't voted for this specific candidate type
                return res.status(200).json({ hasVoted: false });
            }
        }
    } catch (error) {
        console.error('Error checking vote status:', error);
        res.status(500).json({ message: 'Error checking vote status' });
    }
});

app.get("/success_president_student", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'success_president_student.html'));
});

app.get("/success_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'success_council_school.html'));
});

app.get("/success_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'success_councul_normal.html'));
});

app.get("/success_president_faculty", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'success_president_faculty.html'));
});

app.get("/election_result_menu", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'election_result_menu.html'));
});

app.get("/result_president_student", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'result_president_student.html'));
});

app.get("/result_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'result_council_school.html'));
});

app.get("/result_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'result_council_normal.html'));
});

app.get("/result_president_faculty", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'result_president_faculty.html'));
});

app.get("/list_admin", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'list_admin.html'));
});


app.get("/admins", (req, res) => {
    const sql = "SELECT id, username, role FROM staff WHERE role IN ('admin', 'committee')";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Failed to fetch users" });
        }
        res.json(results);
    });
});

app.post("/updateRole", express.json(), (req, res) => {
    const { userId, role } = req.body;
    const sql = "UPDATE users SET role = ? WHERE id = ?";
    db.query(sql, [role, userId], (err, result) => {
        if (err) {
            console.error("Error updating role:", err);
            return res.status(500).json({ error: "Failed to update role" });
        }
        res.json({ message: "Role updated successfully" });
    });
});

app.delete("/delete/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ error: "Failed to delete user" });
        }
        res.json({ message: "User deleted successfully" });
    });
});

app.delete("/delete1/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM staff WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete user" });
        res.json({ message: "User deleted successfully" });
    });
});

app.post("/updateRole1", (req, res) => {
    const { userId, role } = req.body;
    db.query("UPDATE staff SET role = ? WHERE id = ?", [role, userId], (err) => {
        if (err) return res.status(500).json({ error: "Failed to update role" });
        res.json({ message: "Role updated successfully" });
    });
});


app.get("/list_user", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'list_user.html'));
});



app.get("/users", (req, res) => {
    const sql = "SELECT id, name, role FROM users WHERE role IN ('user', 'candidate')";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Failed to fetch users" });
        }
        console.log("Fetched users:", results); // Debugging
        res.json(results);
    });
});

app.get("/list_candidate_menu", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'list_candidate_menu.html'));
});

function fetchCandidatesByType(candidateType, res) {
    const query = `
      SELECT c.id AS candidate_id, c.name AS candidate_name, c.student_id, s.school_name, m.major_name, c.candidate_number, c.photo
      FROM candidates c
      JOIN schools s ON c.school_id = s.id
      JOIN majors m ON c.major_id = m.id
      WHERE c.candidate_type = ?
    `;

    db.query(query, [candidateType], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
}


app.get('/api/candidates', (req, res) => {
    const query = `
      SELECT
        c.id,
        c.name,
        c.studentID,
        c.line_id,  -- ✅ Added Line ID
        c.gpax_level,  -- ✅ Added GPAX Level
        c.gpax,  -- ✅ Added GPAX
        s.school_name AS school,
        m.major_name AS major,
        c.picture_url,
        c.transcript_url,
        c.policy_poster_url,
        c.status,  -- ✅ Added status for frontend
        c.candidate_type
      FROM candidates c
      JOIN schools s ON c.school_id = s.id
      JOIN majors m ON c.major_id = m.id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching candidates:', err);
            return res.status(500).send('Server error');
        }

        results.forEach(candidate => {
            console.log("Before Fix:", candidate.picture_url);

            candidate.picture_url = candidate.picture_url
                ? `/${candidate.picture_url.replace(/\\/g, '/')} `
                : '/uploads/default.jpg';

            candidate.transcript_url = candidate.transcript_url
                ? `/${candidate.transcript_url.replace(/\\/g, '/')} `
                : null;

            candidate.policy_poster_url = candidate.policy_poster_url
                ? `/${candidate.policy_poster_url.replace(/\\/g, '/')} `
                : null;

            console.log("After Fix:", candidate.picture_url);
        });

        res.json(results);
    });
});

app.get('/api/candidates/approve', (req, res) => {
    let type = req.query.type;
    let query = `
      SELECT
        c.id,
        c.name,
        c.studentID,
        c.line_id,
        c.gpax_level,
        c.gpax,
        s.school_name AS school,
        m.major_name AS major,
        c.picture_url,
        c.transcript_url,
        c.policy_poster_url,
        c.candidate_type
      FROM candidates c
      JOIN schools s ON c.school_id = s.id
      JOIN majors m ON c.major_id = m.id
      WHERE c.status = 'Approved'
    `;

    if (type) {
        query += ` AND c.candidate_type = ${db.escape(type)}`;
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching candidates:', err);
            return res.status(500).send('Server error');
        }

        results.forEach(candidate => {
            candidate.picture_url = candidate.picture_url
                ? `/${candidate.picture_url.replace(/\\/g, '/')} `
                : '/uploads/default.jpg';

            candidate.transcript_url = candidate.transcript_url
                ? `/${candidate.transcript_url.replace(/\\/g, '/')} `
                : null;

            candidate.policy_poster_url = candidate.policy_poster_url
                ? `/${candidate.policy_poster_url.replace(/\\/g, '/')} `
                : null;
        });

        res.json(results);
    });
});


app.get('/api/pending', (req, res) => {
    let type = req.query.type; // รับค่าจาก query string

    // สร้าง query สำหรับดึงข้อมูลแคนดิเดตที่สถานะเป็น Pending
    let query = `
      SELECT
        c.id,
        c.name,
        c.studentID,
        c.line_id,
        c.gpax_level,
        c.gpax,
        s.school_name AS school,
        m.major_name AS major,
        c.picture_url,
        c.transcript_url,
        c.policy_poster_url,
        c.status,
        c.candidate_type
      FROM candidates c
      JOIN schools s ON c.school_id = s.id
      JOIN majors m ON c.major_id = m.id
      WHERE c.status = 'Pending'  -- ดึงเฉพาะที่สถานะ Pending
    `;

    // หากมีการส่ง type มาใน query string ให้กรองตาม candidate_type
    if (type) {
        query += ` AND c.candidate_type = ${db.escape(type)}`;
    }

    // Query ไปที่ฐานข้อมูล
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching candidates:', err);
            return res.status(500).send('Server error');
        }

        // ปรับ URL ของรูปภาพและไฟล์ต่างๆ
        results.forEach(candidate => {
            candidate.picture_url = candidate.picture_url
                ? `/${candidate.picture_url.replace(/\\/g, '/')} `
                : '/uploads/default.jpg';

            candidate.transcript_url = candidate.transcript_url
                ? `/${candidate.transcript_url.replace(/\\/g, '/')} `
                : null;

            candidate.policy_poster_url = candidate.policy_poster_url
                ? `/${candidate.policy_poster_url.replace(/\\/g, '/')} `
                : null;
        });

        res.json(results); // ส่งข้อมูลกลับไปยัง frontenืยd
    });
});


app.get('/api/policies/:candidate_id', (req, res) => {
    const candidateId = req.params.candidate_id;
    const query = `
        SELECT p.policy_detail, c.policy_poster_url
        FROM policies p
        JOIN candidates c ON p.candidate_id = c.id
        WHERE c.id = ?
    `;

    db.query(query, [candidateId], (err, results) => {
        if (err) {
            console.error('Error fetching policy details:', err);
            return res.status(500).send('Unable to fetch policy details');
        }

        results.forEach(policy => {
            if (policy.policy_poster_url) {
                // ✅ แก้ path ให้ถูกต้อง
                policy.policy_poster_url = `/${policy.policy_poster_url.replace(/\\/g, '/')}`;
            }
        });

        console.log("✅ Fixed Policy Data:", results); // Debug
        res.json(results);
    });
});

app.get('/api/candidates/:candidate_id/transcript', (req, res) => {
    const candidateId = req.params.candidate_id;
    const query = `
        SELECT c.transcript_url
        FROM candidates c
        WHERE c.id = ?
    `;

    db.query(query, [candidateId], (err, results) => {
        if (err) {
            console.error('Error fetching transcript details:', err);
            return res.status(500).send('Unable to fetch transcript details');
        }

        // If no transcript found, send an appropriate message
        if (results.length === 0 || !results[0].transcript_url) {
            return res.status(404).send('No transcript found for this candidate');
        }

        // Fix the path if the transcript_url exists
        const transcriptUrl = results[0].transcript_url ? `/${results[0].transcript_url.replace(/\\/g, '/')}` : null;

        // Return the transcript URL
        res.json({ transcript_url: transcriptUrl });
    });
});

app.get('/getCandidates', (req, res) => {
    const query = `
      SELECT c.name AS candidate_name, s.school_name, m.major_name, p.policy_detail, c.picture_url
      FROM candidates c
      JOIN schools s ON c.school_id = s.id
      JOIN majors m ON c.major_id = m.id
      LEFT JOIN policies p ON c.id = p.candidate_id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/policies/:candidate_id', (req, res) => {
    const candidateId = req.params.candidate_id;  // Corrected parameter name

    const query = `
        SELECT p.policy_detail, c.policy_poster_url
        FROM policies p
        JOIN candidates c ON p.candidate_id = c.id
        WHERE c.id = ?
    `;

    db.query(query, [candidateId], (err, results) => {
        if (err) {
            console.error('Error fetching policies: ', err);
            return res.status(500).send('Unable to fetch policies');
        }

        res.json(results);
    });
});

// Update candidate information
app.put('/api/updateCandidate/:id', (req, res) => {
    const { updatedName, updatedStudentId, updatedSchoolId, updatedMajorId } = req.body;
    const candidateId = req.params.id;

    if (!updatedName || !updatedStudentId || !updatedSchoolId || !updatedMajorId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const query = `
        UPDATE candidates 
        SET name = ?, studentID = ?, school_id = ?, major_id = ? 
        WHERE id = ?
    `;
    db.query(query, [updatedName, updatedStudentId, updatedSchoolId, updatedMajorId, candidateId], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database query failed" });
        }
        res.json({ success: true });
    });
});

app.get("/info_president_student", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'info_president_student.html'));
});

app.get("/info_add_president_student", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'info_add_president_student.html'));
});

app.get("/info_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'info_council_school.html'));
});

app.get("/info_add_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'info_add_council_school.html'));
});

app.get("/info_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'info_council_normal.html'));
});

app.get("/info_add_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'info_add_council_normal.html'));
});

app.get("/info_president_faculty", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'info_president_faculty.html'));
});

app.get("/PDPA_edit", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'PDPA_edit.html'));
});

app.get('/fetch-pdpa', (req, res) => {
    db.query('SELECT * FROM pdpa_content WHERE id = 1', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results[0]);
    });
});

app.post('/update-pdpa-content', upload.single('image'), (req, res) => {
    const { headerText, radioLabel, swalMessage } = req.body;
    let imagePath = null;

    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
    }

    let sql = 'UPDATE pdpa_content SET header_text=?, radio_label=?, swal_message=?';
    const params = [headerText, radioLabel, swalMessage];

    if (imagePath) {
        sql += ', image_path=?';
        params.push(imagePath);
    }

    sql += ' WHERE id=1';

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

app.delete('/delete-image', (req, res) => {
    const sqlSelect = 'SELECT image_path FROM pdpa_content LIMIT 1';

    db.query(sqlSelect, (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err });

        const imagePath = result[0]?.image_path;
        if (!imagePath) return res.json({ success: true }); // No image, no need to delete

        const filePath = path.join(__dirname, 'public', 'img', imagePath);

        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                return res.status(500).json({ success: false, error: unlinkErr.message });
            }

            const sqlUpdate = 'UPDATE pdpa_content SET image_path = NULL';
            db.query(sqlUpdate, (updateErr, updateResult) => {
                if (updateErr) return res.status(500).json({ success: false, error: updateErr });
                res.json({ success: true });
            });
        });
    });
});

app.get("/datetime_setter_menu", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'datetime_setter_menu.html'));
});

app.get("/datetime_setter_register", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'datetime_setter_register.html'));
});

app.get("/datetime_setter_info", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'datetime_setter_info.html'));
});

app.get("/datetime_setter_vote", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'datetime_setter_vote.html'));
});

app.get("/datetime_setter_score", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'datetime_setter_score.html'));
});

const validEvents = [
    "President of the Student Union Candidate Register",
    "Student Council Member (School of) Register",
    "Student Council Member (Normal) Register",
    "President of the Student Union Candidate Information",
    "Student Council Member (School of) Information",
    "Student Council Member (Normal) Information",
    "President of Student Association Information",
    "President of the Student Union Candidate Vote",
    "Student Council Member (School of) Vote",
    "Student Council Member (Normal) Vote",
    "President of Student Association Vote",
    "President of the Student Union Candidate Result",
    "Student Council Member (School of) Result",
    "Student Council Member (Normal) Result",
    "President of Student Association Result"
];

// Endpoint to set the datetime
// Endpoint to set or update the datetime
app.post('/datetime_setter', (req, res) => {
    const { eventType, startDatetime, endDatetime } = req.body;

    if (!validEvents.includes(eventType)) {
        return res.status(400).json({ message: "Invalid event type" });
    }

    const [start_date, start_time] = startDatetime.split('T');
    const [end_date, end_time] = endDatetime.split('T');

    // Check if the event type already has an entry in the database
    const selectQuery = "SELECT * FROM setter WHERE event_type = ?";
    db.query(selectQuery, [eventType], (selectError, selectResults) => {
        if (selectError) {
            return res.status(500).json({ message: "Error checking existing datetime", error: selectError.message });
        }

        if (selectResults.length > 0) {
            // If the event already exists, update the existing record
            const updateQuery = "UPDATE setter SET start_date = ?, start_time = ?, end_date = ?, end_time = ? WHERE event_type = ?";
            const updateValues = [start_date, start_time, end_date, end_time, eventType];
            db.query(updateQuery, updateValues, (updateError, updateResult) => {
                if (updateError) {
                    return res.status(500).json({ message: "Error updating the datetime.", error: updateError.message });
                }
                res.json({ message: "Datetime updated successfully" });
            });
        } else {
            // If the event doesn't exist, insert a new record
            const insertQuery = "INSERT INTO setter (event_type, start_date, start_time, end_date, end_time) VALUES (?, ?, ?, ?, ?)";
            const insertValues = [eventType, start_date, start_time, end_date, end_time];
            db.query(insertQuery, insertValues, (insertError, insertResult) => {
                if (insertError) {
                    return res.status(500).json({ message: "Error saving the datetime.", error: insertError.message });
                }
                res.json({ message: "Datetime set successfully" });
            });
        }
    });
});

app.get('/datetime_getter', (req, res) => {
    const { eventType } = req.query;

    if (!eventType) {
        return res.status(400).json({ message: 'Event type is required' });
    }

    const query = "SELECT * FROM setter WHERE event_type = ?";

    db.query(query, [eventType], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error retrieving event datetime', error: error.message });
        }

        if (results.length > 0) {
            // Send the first matching result, adjust the response as necessary
            const event = results[0];
            res.json({
                start_date: event.start_date,
                start_time: event.start_time,
                end_date: event.end_date,
                end_time: event.end_time,
            });
        } else {
            res.json({ message: 'No datetime set for this event' });
        }
    });
});

app.get('/active-events', (req, res) => {
    // Get the current date and time
    const currentDate = new Date();
    const localDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000);
    const currentDateString = localDate.toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const currentTimeString = localDate.toISOString().split('T')[1].split('.')[0]; // Current time in HH:mm:ss format

    console.log("Local Date:", localDate);
    console.log("Current Date String:", currentDateString);
    console.log("Current Time String:", currentTimeString);

    // Merge start_date and start_time to form start_datetime
    const currentDateTimeString = `${currentDateString} ${currentTimeString}`;

    const query = `
        SELECT event_type
        FROM setter
        WHERE CONCAT(start_date, ' ', start_time) <= ? 
          AND CONCAT(end_date, ' ', end_time) >= ?
        ORDER BY start_date, start_time;
    `;

    db.execute(query, [currentDateTimeString, currentDateTimeString], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        console.log("Query Results:", results); // Log results to check if events are returned

        const activeEvents = results.map(row => row.event_type);
        res.json(activeEvents); // Return active events
    });
});

app.get("/add_candidate", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'add_candidate.html'));
});

app.get("/add_user", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'add_user.html'));
});

app.get("/election_score_menu", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'election_score_menu.html'));
});

app.get("/score_president_student", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'score_president_student.html'));
});

app.get("/score_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'score_council_school.html'));
});

app.get("/score_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public','score_council_normal.html'));
});

app.get("/score_president_faculty", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'score_president_faculty.html'));
});

app.get('/api/candidates/approved-scores', (req, res) => {
    const type = req.query.type;

    let query = `
      SELECT 
        c.id,
        c.name,
        c.studentID,
        c.candidate_type,
        v.candidate_id,
        COUNT(v.id) AS vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.status = 'Approved'
    `;

    if (type) {
        query += ` AND c.candidate_type = ${db.escape(type)}`;
    }

    query += ` GROUP BY c.id`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send('Error fetching candidates');

        const votersQuery = `
        SELECT COUNT(DISTINCT student_id) AS totalVoters
        FROM votes
        ${type ? `WHERE candidate_type = ${db.escape(type)}` : ''}
      `;

        db.query(votersQuery, (err, votersResults) => {
            if (err) return res.status(500).send('Error fetching voters');

            const totalVoters = votersResults[0]?.totalVoters || 0;

            const noVoteQuery = `
          SELECT COUNT(*) AS noVoteCount
          FROM votes
          WHERE candidate_id IS NULL
          ${type ? `AND candidate_type = ${db.escape(type)}` : ''}
        `;

            db.query(noVoteQuery, (err, noVoteResults) => {
                if (err) return res.status(500).send('Error fetching no votes');

                const noVoteCount = noVoteResults[0]?.noVoteCount || 0;

                const eligibleQuery = `
            SELECT COUNT(*) AS totalEligible
            FROM users
            WHERE role IN ('candidate', 'user');
          `;

                db.query(eligibleQuery, (err, eligibleResults) => {
                    if (err) return res.status(500).send('Error fetching eligible voters');

                    const totalEligible = eligibleResults[0]?.totalEligible || 0;

                    const schoolPromises = results.map(candidate => {
                        return new Promise((resolve, reject) => {
                            const schoolQuery = `
                  SELECT s.school_name 
                  FROM users u
                  JOIN school_codes sc ON SUBSTRING(u.studentID, 4, 2) = sc.school_code
                  JOIN schools s ON sc.school_id = s.id
                  WHERE u.studentID = ?
                `;

                            db.execute(schoolQuery, [candidate.studentID], (err, schoolResults) => {
                                if (err) return reject(err);
                                candidate.school = schoolResults[0]?.school_name || 'Unknown';
                                resolve(candidate);
                            });
                        });
                    });

                    Promise.all(schoolPromises)
                        .then(updatedCandidates => {
                            res.json({
                                candidates: updatedCandidates,
                                totalVoters,
                                noVoteCount,
                                totalEligible
                            });
                        })
                        .catch(() => res.status(500).json({ message: 'Error fetching school data' }));
                });
            });
        });
    });
});

app.get('/api/candidates/approved-scores1', (req, res) => {
    const type = req.query.type;

    let query = `
      SELECT 
        c.id,
        c.name,
        c.studentID,
        c.candidate_type,
        v.candidate_id,
        COUNT(v.id) AS vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.status = 'Pending'
    `;

    if (type) {
        query += ` AND c.candidate_type = ${db.escape(type)}`;
    }

    query += ` GROUP BY c.id`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send('Error fetching candidates');

        const votersQuery = `
        SELECT COUNT(DISTINCT student_id) AS totalVoters
        FROM votes
        ${type ? `WHERE candidate_type = ${db.escape(type)}` : ''}
      `;

        db.query(votersQuery, (err, votersResults) => {
            if (err) return res.status(500).send('Error fetching voters');

            const totalVoters = votersResults[0]?.totalVoters || 0;

            const noVoteQuery = `
          SELECT COUNT(*) AS noVoteCount
          FROM votes
          WHERE candidate_id IS NULL
          ${type ? `AND candidate_type = ${db.escape(type)}` : ''}
        `;

            db.query(noVoteQuery, (err, noVoteResults) => {
                if (err) return res.status(500).send('Error fetching no votes');

                const noVoteCount = noVoteResults[0]?.noVoteCount || 0;

                const eligibleQuery = `
            SELECT COUNT(*) AS totalEligible
            FROM users
            WHERE role IN ('candidate', 'user');
          `;

                db.query(eligibleQuery, (err, eligibleResults) => {
                    if (err) return res.status(500).send('Error fetching eligible voters');

                    const totalEligible = eligibleResults[0]?.totalEligible || 0;

                    const schoolPromises = results.map(candidate => {
                        return new Promise((resolve, reject) => {
                            const schoolQuery = `
                  SELECT s.school_name 
                  FROM users u
                  JOIN school_codes sc ON SUBSTRING(u.studentID, 4, 2) = sc.school_code
                  JOIN schools s ON sc.school_id = s.id
                  WHERE u.studentID = ?
                `;

                            db.execute(schoolQuery, [candidate.studentID], (err, schoolResults) => {
                                if (err) return reject(err);
                                candidate.school = schoolResults[0]?.school_name || 'Unknown';
                                resolve(candidate);
                            });
                        });
                    });

                    Promise.all(schoolPromises)
                        .then(updatedCandidates => {
                            res.json({
                                candidates: updatedCandidates,
                                totalVoters,
                                noVoteCount,
                                totalEligible
                            });
                        })
                        .catch(() => res.status(500).json({ message: 'Error fetching school data' }));
                });
            });
        });
    });
});


app.get("/condition_edit_president", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'condition_edit_president.html'));
});

app.get("/condition_edit_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'condition_edit_council_school.html'));
});

app.get("/condition_edit_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'condition_edit_council_normal.html'));
});

// Endpoint to fetch header text by id
app.get("/header/:id", (req, res) => {
    const headerId = req.params.id; // รับ headerId จาก URL
    db.query("SELECT text FROM headers WHERE id = ?", [headerId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) {
            res.json(result[0]); // ส่งข้อมูลของ header ที่ตรงกับ id
        } else {
            res.status(404).json({ error: "Header not found" });
        }
    });
});

// อัปเดตข้อความใน header โดยใช้ headerId
app.put("/save-header/:id", (req, res) => {
    const headerId = req.params.id;
    const { headerText } = req.body;  // ข้อความใหม่ที่ได้รับจาก frontend

    // อัปเดตข้อความในฐานข้อมูล
    db.query("UPDATE headers SET text = ? WHERE id = ?", [headerText, headerId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows > 0) {
            res.json({ message: "Header updated successfully!" });
        } else {
            res.status(404).json({ error: "Header not found" });
        }
    });
});

// อัปโหลดรูปภาพ
app.post("/upload", upload.array("images", 5), (req, res) => { // `images` คือชื่อของ input ใน HTML
    if (!req.files) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const headerId = req.body.headerId;  // รับ headerId จากฟอร์ม
    const filePaths = req.files.map(file => "/uploads/" + file.filename); // กำหนด path ของไฟล์ที่อัปโหลด

    // บันทึกข้อมูลไฟล์ที่อัปโหลดลงฐานข้อมูล
    const query = "INSERT INTO uploaded_images (header_id, file_path) VALUES ?";
    const values = filePaths.map(filePath => [headerId, filePath]);

    db.query(query, [values], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Images uploaded successfully!" });
    });
});

// ดึงรูปภาพทั้งหมดหรือรูปภาพตาม header_id
app.get("/images", (req, res) => {
    const { headerId } = req.query;

    const query = headerId
        ? "SELECT file_path FROM uploaded_images WHERE header_id = ?"
        : "SELECT file_path FROM uploaded_images";

    db.query(query, [headerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ลบรูปภาพตาม id
// Endpoint สำหรับลบรูปภาพตาม file_path
app.post('/delete-image', (req, res) => {
    const { filePath } = req.body;  // รับ file_path ที่ส่งมาจาก frontend

    if (!filePath) {
        return res.status(400).json({ error: 'File path is required.' });  // ตรวจสอบ file_path ว่ามีค่าไหม
    }

    console.log('Received file path for deletion:', filePath);  // ตรวจสอบค่า file_path

    // ลบไฟล์จากระบบไฟล์
    fs.unlink(path.join(__dirname, filePath), (err) => {
        if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).json({ error: 'Error deleting file' });
        }

        // ลบข้อมูลจากฐานข้อมูล
        db.query('DELETE FROM uploaded_images WHERE file_path = ?', [filePath], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Error deleting image from database' });
            }

            if (result.affectedRows > 0) {
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ error: 'Image not found in database' });
            }
        });
    });
});


// 📌 อัปเดตรูปภาพ
app.put("/update-image", upload.single("image"), (req, res) => {
    const { filePath } = req.body;
    if (!filePath || !req.file) {
        return res.status(400).json({ success: false, error: "Missing parameters" });
    }

    const newFilePath = "/uploads/" + req.file.filename;

    db.query(
        "UPDATE uploaded_images SET file_path = ? WHERE file_path = ?",
        [newFilePath, filePath],
        (err, result) => {
            if (err) {
                console.error("❌ Error updating image:", err);
                return res.status(500).json({ success: false, error: "Database error" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: "Image not found in database" });
            }

            res.json({ success: true, newFilePath });
        }
    );
});

app.get("/approve_president", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'approve_president.html'));
});

app.get("/approve_council_school", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'approve_council_school.html'));
});

app.get("/approve_council_normal", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'approve_council_normal.html'));
});


app.put('/api/candidates/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    // อัปเดตสถานะของผู้สมัครในตาราง candidates
    db.query("UPDATE candidates SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) {
            console.error("Error updating candidate status:", err);
            return res.status(500).json({ message: "Database error" });
        }

        // ถ้าสถานะเป็น Approved ต้องอัปเดต role ของผู้ใช้งานเป็น candidate
        if (status === "Approved") {
            // เรียกใช้คำสั่งเพื่ออัปเดต role ของผู้ใช้เป็น candidate
            db.query("UPDATE users SET role = 'candidate' WHERE studentID = (SELECT studentID FROM candidates WHERE id = ?)", [id], (err2, result2) => {
                if (err2) {
                    console.error("Error updating user role:", err2);
                    return res.status(500).json({ message: "Error updating user role" });
                }

                // ส่งผลลัพธ์สำเร็จ
                res.status(200).json({ message: `Candidate marked as ${status} and role updated to candidate` });
            });
        } else {
            // ถ้าสถานะเป็น Rejected ก็ส่งข้อความไป
            res.status(200).json({ message: `Candidate marked as ${status}` });
        }
    });
});
app.get("/history", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', '/history.html'));
});

app.get('/api/candidates/history', (req, res) => {
    db.query("SELECT * FROM candidates WHERE status IN ('Approved', 'Rejected')", (err, result) => {
        if (err) {
            console.error("Error fetching candidates history:", err);
            return res.status(500).json({ message: "Error fetching data" });
        }
        res.json(result); // ส่งข้อมูลผู้สมัครที่มีสถานะ Approved หรือ Rejected
    });
});

app.get('/api/vote-pictures', (req, res) => {
    // Query to get candidate pictures of all voted candidates
    const query = `
      SELECT c.picture_url 
      FROM votes v
      JOIN candidates c ON v.candidate_id = c.id
      GROUP BY c.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('SQL error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No votes found' });
        }

        // Loop through the results to create an array of image URLs
        const imageUrls = results.map(row => row.picture_url.replace(/\\/g, '/'));

        // Create an array to hold base64 images
        const imagesData = [];

        // Read each image and convert to base64
        let imagesProcessed = 0;
        imageUrls.forEach((pictureUrl, index) => {
            const absolutePath = path.join(__dirname, pictureUrl);

            fs.readFile(absolutePath, (err, data) => {
                if (err) {
                    console.error('File read error:', err);
                    return res.status(500).json({ error: 'Error reading file' });
                }

                const ext = path.extname(absolutePath).toLowerCase();
                let mimeType = 'image/jpeg';
                if (ext === '.png') {
                    mimeType = 'image/png';
                } else if (ext === '.gif') {
                    mimeType = 'image/gif';
                }

                const base64Data = data.toString('base64');
                const dataUri = `data:${mimeType};base64,${base64Data}`;
                imagesData.push(dataUri);

                imagesProcessed++;

                // Once all images are processed, send the response
                if (imagesProcessed === imageUrls.length) {
                    res.json({ imageData: imagesData });
                }
            });
        });
    });
});

app.post("/update-slide/:id", upload.single("image"), (req, res) => {
    const { id } = req.params;
    const { textDetail, linkDetail } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let sql = "UPDATE slides SET textDetail = ?, linkDetail = ?";
    let values = [textDetail, linkDetail];

    if (req.file) {
        sql += ", imagePath = ?";
        values.push(imagePath);
    }

    sql += " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err
            });
        }

        res.json({
            success: true,
            message: "Slide updated successfully",
            imagePath: imagePath || ""
        });
    });
});

// Fetch Slides API
app.get('/get-slides', (req, res) => {
    const sql = 'SELECT id, textDetail, linkDetail, imagePath FROM slides';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database Error: ", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Slides fetched from database:", results);
        res.json(results);
    });
});

app.post('/add-user', (req, res) => {
    const { name, email, studentID, role } = req.body;

    const sql = `INSERT INTO users (name, email, studentID, role) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, email, studentID, role], (err, result) => {
        if (err) {
            console.error('Error adding user:', err);
            return res.status(500).json({ message: "Server error adding user" });
        }
        res.json({ message: "User added successfully!" });
    });
});

app.get('/api/election-results1', (req, res) => {
    const query = `
        SELECT 
            c.id AS candidate_id,
            c.name,
            c.picture_url,
            COUNT(v.id) AS score
        FROM candidates c
        LEFT JOIN votes v 
            ON c.id = v.candidate_id 
            AND v.is_abstention = 0
            AND v.candidate_type = 'President of the Student Union Candidate'
        WHERE c.candidate_type = 'President of the Student Union Candidate'
            AND c.status = 'Approved'
        GROUP BY c.id
        ORDER BY score DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching election results:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});


app.get('/api/election-results3', (req, res) => {
    const query = `
        SELECT 
            c.id AS candidate_id,
            c.name,
            c.picture_url,
            COUNT(v.id) AS score
        FROM candidates c
        LEFT JOIN votes v 
            ON c.id = v.candidate_id 
            AND v.is_abstention = 0
            AND v.candidate_type = 'Student council member (Normal) '
        WHERE c.candidate_type = 'Student council member (Normal)'
            AND c.status = 'Approved'
        GROUP BY c.id
        ORDER BY score DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching election results:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.get('/api/election-results4', (req, res) => {
    const query = `
        SELECT 
            c.id AS candidate_id,
            c.name,
            c.picture_url,
            COUNT(v.id) AS score
        FROM candidates c
        LEFT JOIN votes v 
            ON c.id = v.candidate_id 
            AND v.is_abstention = 0
            AND v.candidate_type = 'President of the Faculty Student Council'
        WHERE c.candidate_type = 'President of the Faculty Student Council'
            AND c.status = 'Pending'
        GROUP BY c.id
        ORDER BY score DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching election results:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});



app.get('/api/election-results2', (req, res) => {
    const code = req.query.code; // เช่น '14'

    const query = `
        SELECT c.id AS candidate_id, c.name, c.picture_url, COUNT(v.id) AS score
        FROM candidates c
        LEFT JOIN votes v ON v.candidate_id = c.id 
            AND v.candidate_type = 'Student council member (School of)' 
            AND v.is_abstention = 0
        JOIN school_codes sc ON c.school_id = sc.school_id
        WHERE sc.school_code = ?
            AND c.candidate_type = 'Student council member (School of)'
            AND c.status = 'Approved'
        GROUP BY c.id, c.name, c.picture_url
        ORDER BY score DESC
    `;

    db.execute(query, [code], (err, results) => {
        if (err) {
            console.error("❌ SQL Error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.json(results);
    });
});

app.post('/api/staff/add', async (req, res) => {
    const { username, role } = req.body;

    if (!username || !role) {
        return res.status(400).json({ error: 'Username and role are required' });
    }

    try {
        db.query('SELECT * FROM staff WHERE username = ?', [username], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            const rawPassword = `${username}123`;
            const hashedPassword = await bcrypt.hash(rawPassword, 10);

            const insertSql = `INSERT INTO staff (username, password, role) VALUES (?, ?, ?)`;
            db.query(insertSql, [username, hashedPassword, role], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error inserting user' });
                }

                res.json({
                    username,
                    role,
                    generatedPassword: rawPassword
                });
            });
        });
    } catch (error) {
        console.error('Add staff error:', error);
        res.status(500).json({ error: 'Unexpected server error' });
    }
});


app.post('/api/staff/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query('SELECT * FROM staff WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect old password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        db.query('UPDATE staff SET password = ? WHERE username = ?', [hashedNewPassword, username], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating password' });
            }

            res.json({ message: 'Password changed successfully' });
        });
    });
});


app.post('/loginstaff', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const sql = 'SELECT * FROM staff WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('DB error:', err);
            return res.status(500).json({ success: false, message: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            role: user.role // either 'admin' or 'committee'
        });
    });
});

// Express route
app.get("/staff-info", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch staff info from the database
    db.query("SELECT id, username, role FROM staff WHERE id = ?", [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0) {
            return res.status(404).json({ error: "Staff not found" });
        }

        const { id, username, role } = results[0];
        res.json({ id, username, role });
    });
});



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
