const express = require('express');
require("dotenv").config();
const router = express.Router();
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const path = require('path');  // Required for file path handling
const app = express();
const cors = require('cors');
app.use(cors()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'view')));
app.use(express.static(path.join(__dirname, 'admin')));
app.use(express.static(path.join(__dirname, 'user')));
app.use(express.static(path.join(__dirname, 'comittee')));
// Serve static files from "public" folder

// Database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Change to your MySQL username
    database: 'candidate2'  // Change to your database name
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

app.use("/public", express.static("D:/ProjectH/public"));
app.use("/view", express.static("D:/ProjectH/view"));
app.use("/admin", express.static("D:/ProjectH/view/admin"));
app.use("/user", express.static("D:/ProjectH/view/user"));
app.use("/comittee", express.static("D:/ProjectH/view/committee"));


// Serve the login page when the user visits "/login"
app.get('/login', (req, res) => {
    // Serve the login.html file from the "public" folder
    res.sendFile(path.join('D:/ProjectH/view/user/login.html'));
});


app.get('/home', (req, res) => {
    res.sendFile(path.join('D:/ProjectH/view/user/home.html'));
});

app.get('/admin_home', (req, res) => {
    res.sendFile(path.join('D:/ProjectH/view/admin/admin_home.html'));
});

app.get('/committee_home', (req, res) => {
    res.sendFile(path.join('D:/ProjectH/view/committee/committee_home.html'));
});

app.get('/PDPA_president', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/PDPA_president.html'));
});

app.get('/PDPA_council_school', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/PDPA_council_school.html'));
});

app.get('/PDPA_council_normal', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/PDPA_council_normal.html'));
});
app.get('/election_result_menu', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/election_result_menu.html'));
});

app.get('/vote_president_student', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/vote_president_student.html'));
});

app.get('/vote_council_school', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/vote_council_school.html'));
});

app.get('/vote_council_normal', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/vote_council_normal.html'));
});

app.get('/vote_president_faculty', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/vote_president_faculty.html'));
});

app.get('/condition_president', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/condition_president.html'));
});


app.get('/condition_council_school', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/condition_council_school.html'));
});


app.get('/condition_council_normal', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/condition_council_normal.html'));
});

app.get('/result_president_student', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/result_president_student.html'));
});

app.get('/result_council_school', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/result_council_school.html'));
});

app.get('/result_council_normal', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/result_council_normal.html'));
});

app.get('/result_president_faculty', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/result_president_faculty.html'));
});

app.get('/candidate_register_president', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/candidate_register_president.html'));
});

app.get('/candidate_register_council_school', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/candidate_register_council_school.html'));
});

app.get('/candidate_register_council_normal', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/candidate_register_council_normal.html'));
});

app.get("/success_president_student", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/user/success_president_student.html"));
});

app.get("/success_council_school", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/user/success_council_school.html"));
});

app.get("/success_council_normal", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/user/success_council_normal.html"));
});

app.get("/success_president_faculty", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/user/success_president_faculty.html"));
});

app.get("/list_admin", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/list_admin.html"));
});

app.get("/list_user", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/list_user.html"));
});

app.get("/list_candidate_menu", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/list_candidate_menu.html"));
});

app.get("/datetime_setter_menu", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/datetime_setter_menu.html"));
});

app.get("/add_candidate", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/add_candidate.html"));
});

app.get("/election_score_menu", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/election_score_menu.html"));
});

app.get("/PDPA_edit", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/PDPA_edit.html"));
});

app.get("/info_president_student", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/info_president_student.html"));
});

app.get("/info_add_president_student", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/info_add_president_student.html"));
});

app.get("/info_council_school", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/info_council_school.html"));
});

app.get("/info_add_council_school", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/info_add_council_school.html"));
});

app.get("/info_council_normal", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/info_council_normal.html"));
});

app.get("/info_add_council_normal", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/info_add_council_normal.html"));
});

app.get("/info_president_faculty", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/info_president_faculty.html"));
});

app.get("/score_president_student", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/score_president_student.html"));
});

app.get("/score_council_school", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/score_council_school.html"));
});

app.get("/score_council_normal", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/score_council_normal.html"));
});

app.get("/score_persident_faculty", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/score_persident_faculty.html"));
});

app.get("/condition_edit_president", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/committee/condition_edit_president.html"));
});

app.get("/add_user", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/admin/add_user.html"));
});

app.get("/approve_president", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/committee/approve_president.html"));
});

app.get("/approve_council_school", (req, res) => {
    res.sendFile(path.join("D:/projectH/view/committee/approve_council_school.html"));
});

app.get('/success_president_student', (req, res) => {
    res.sendFile(path.join('D:/projectH/view/user/success_president_student.html'));
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

            // ✅ Ensure Email is from MFU
            if (!email.endsWith("@lamduan.mfu.ac.th")) {
                return done(null, false, { message: "Only @lamduan.mfu.ac.th emails are allowed!" });
            }

            const studentID = email.split("@")[0]; // Extract Student ID

            // ✅ Check if User Exists in Database
            db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
                if (err) return done(err);

                if (results.length > 0) {
                    // User Exists, Return Their Data
                    return done(null, results[0]);
                } else {
                    // Insert New User with Default Role
                    const newUser = {
                        name: profile.displayName,
                        email: email,
                        studentID: studentID,
                        role: "user", // Default role
                    };

                    db.query("INSERT INTO users SET ?", newUser, (err, insertResult) => {
                        if (err) return done(err);
                        newUser.id = insertResult.insertId;
                        return done(null, newUser);
                    });
                }
            });
        }
    )
);

// ✅ Serialize User (Store User ID in Session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// ✅ Deserialize User (Fetch Full User Details)
passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
});

// ✅ Google OAuth Login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Google OAuth Callback (Final Authentication Step)
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

            if (userRole === "admin") {
                redirectUrl = "/admin_home";
            } else if (userRole === "committee") {
                redirectUrl = "/committee_home";
            }

            // ✅ Issue JWT Token for API Authentication
            const token = jwt.sign(
                { id: req.user.id, email: req.user.email, role: userRole },
                "your_jwt_secret",
                { expiresIn: "1h" }
            );

            // ✅ Redirect with JWT Token
            res.redirect(`${redirectUrl}?token=${token}&user=${encodeURIComponent(req.user.displayName)}`);
        });
    }
);

// ✅ Standard Login Route (For Manual Username & Password)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "user" && password === "user123") {
        const token = jwt.sign({ role: "admin" }, "your_jwt_secret", { expiresIn: "1h" });
        res.json({ token, redirectUrl: "/home" });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// ✅ Protected Route (Example Usage of JWT Authentication)
app.get("/protected", (req, res) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, "your_jwt_secret", (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        res.json({ message: "Access granted", user: decoded });
    });
});

// ✅ Logout Route (Session-Based Logout)
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
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

app.post("/register-candidate", upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "policy_poster", maxCount: 1 }
]), (req, res) => {
    console.log("Received Body:", req.body); // Debugging line
    console.log("Received Files:", req.files); // Debugging line

    const { name, studentID, school_id, major_id, line_id, gpax, gpax_level, candidate_type } = req.body;

    if (!candidate_type) {
        return res.status(400).json({ error: "Candidate type is missing" });
    }

    const picture_url = req.files["picture"] ? req.files["picture"][0].path : null;
    const transcript_url = req.files["transcript"] ? req.files["transcript"][0].path : null;
    const policy_poster_url = req.files["policy_poster"] ? req.files["policy_poster"][0].path : null;

    const sql = `
        INSERT INTO candidates (name, studentID, school_id, major_id, line_id, gpax, gpax_level, candidate_type, picture_url, transcript_url, policy_poster_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

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

// Error Handling for File Uploads
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File size exceeds 50 MB limit" });
    }
    next(err);
});

// Submit policy for a candidate
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

app.post('/add-user', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL to insert user data
        const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
        db.query(query, [username, hashedPassword, role], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "User addition failed, please try again later." });
            }

            res.status(200).json({ message: "User added successfully!" });
        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "There was an error processing your request." });
    }
});

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
        c.candidate_type
        c.status  -- ✅ Added status for frontend
      FROM candidates c
      JOIN schools s ON c.school_id = s.id
      JOIN majors m ON c.major_id = m.id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching candidates:', err);
            return res.status(500).send('Server error');
        }
        console.log('Fetched candidates:', results);

        if (results.length === 0) {
            return res.status(404).send('No candidates found');
        }
        results.forEach(candidate => {
            console.log("Before Fix:", candidate.picture_url); // Debug ก่อนแก้
    
            candidate.picture_url = candidate.picture_url 
                ? `/${candidate.picture_url.replace(/\\/g, '/')} `// เอา /uploads/ ออก
                : '/uploads/default.jpg';
    
            candidate.transcript_url = candidate.transcript_url 
                ? `/${candidate.transcript_url.replace(/\\/g, '/')} `
                : null;
    
            candidate.policy_poster_url = candidate.policy_poster_url 
                ? `/${candidate.policy_poster_url.replace(/\\/g, '/')} `
                : null;
    
            console.log("After Fix:", candidate.picture_url); // Debug หลังแก้
        });
    
        res.json(results);
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


  // 📌 API อัปโหลดรูปและบันทึก URL ลงฐานข้อมูล
app.post("/upload/:candidate_id", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const { candidate_id } = req.params;
    const sql = "UPDATE candidates SET picture_url = ? WHERE id = ?";
    
    db.query(sql, [imageUrl, candidate_id], (err, result) => {
        if (err) throw err;
        res.json({ message: "Upload successful", imageUrl });
    });
});

// 📌 API ดึงข้อมูลผู้สมัครและแสดงรูป
app.get("/candidates", (req, res) => {
    const sql = `
        SELECT name, studentID, picture_url, transcript_url, policy_poster_url 
        FROM candidates
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

app.post("/upload/:studentID", upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "poster", maxCount: 1 }
]), (req, res) => {
    const { studentID } = req.params;

    const findCandidateSQL = "SELECT id FROM candidates WHERE studentID = ?";
    db.query(findCandidateSQL, [studentID], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Candidate not found" });

        const candidate_id = results[0].id;
        const pictureUrl = req.files["picture"] ? `http://localhost:3000/uploads/${req.files["picture"][0].filename}` : null;
        const transcriptUrl = req.files["transcript"] ? `http://localhost:3000/uploads/${req.files["transcript"][0].filename}` : null;
        const posterUrl = req.files["poster"] ? `http://localhost:3000/uploads/${req.files["poster"][0].filename}` : null;

        const updateSQL = "UPDATE candidates SET picture_url = ?, transcript_url = ?, policy_poster_url = ? WHERE id = ?";
        db.query(updateSQL, [pictureUrl, transcriptUrl, posterUrl, candidate_id], (err) => {
            if (err) return res.status(500).json({ error: "Database update error" });
            res.json({ message: "Upload successful", pictureUrl, transcriptUrl, posterUrl });
        });
    });
});


// ✅ Keep only one route for updating status
app.put('/api/candidates/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    db.query("UPDATE candidates SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) {
            console.error("Error updating candidate status:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json({ message: `Candidate marked as ${status}` });
    });
});

app.get("/admins", (req, res) => {
    const sql = "SELECT id, name, role FROM users WHERE role IN ('admin', 'committee')";
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

app.get("/list_user", (req, res) => {
    res.sendFile(path.join("D:/candidate/view/admin/list_user.html"));
});

app.get("/users", (req, res) => {
    const sql = "SELECT id, name, role FROM users WHERE role IN ('user', 'candidate')";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Failed to fetch users" });
        }
        res.json(results);
    });
});


//candidate
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
        let candidateType = 'Student council member (School of study)'; // Default value for abstention

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

app.get('/api/vote-picture', (req, res) => {
    // Query to fetch candidate images (e.g., fetching all pictures for the most recently voted candidate)
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
  
      // Process each picture_url and create an array of base64 images
      const imageDataArray = [];
  
      // Iterate over the results and process each picture_url
      results.forEach(result => {
        let pictureUrl = result.picture_url; // Example: "uploads/82e3fbae0d564a0821d19bfa30050de5.jpg"
        pictureUrl = pictureUrl.replace(/\\/g, '/'); // Convert backslashes to forward slashes
  
        const absolutePath = path.join(__dirname, pictureUrl);
  
        // Read each image and convert to Base64
        fs.readFile(absolutePath, (err, data) => {
          if (err) {
            console.error('File read error:', err);
            return res.status(500).json({ error: 'Error reading file' });
          }
  
          // Determine mime type based on file extension
          const ext = path.extname(absolutePath).toLowerCase();
          let mimeType = 'image/jpeg';
          if (ext === '.png') {
            mimeType = 'image/png';
          } else if (ext === '.gif') {
            mimeType = 'image/gif';
          }
  
          // Convert file to Base64 string
          const base64Data = data.toString('base64');
          const dataUri = `data:${mimeType};base64,${base64Data}`;
  
          // Push the Data URI into the array
          imageDataArray.push(dataUri);
  
          // If it's the last image (or last item in the result set), send the response
          if (imageDataArray.length === results.length) {
            res.json({ images: imageDataArray });
          }
        });
      });
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
        c.status,
        c.candidate_type
      FROM candidates c
      JOIN schools s ON c.school_id = s.id
      JOIN majors m ON c.major_id = m.id
      WHERE c.status = 'Approved'`
    ;

    if (type) {
        query +=  `AND c.candidate_type = ${db.escape(type)}`;
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


//history api

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

app.get('/api/candidates/history', (req, res) => {
    db.query("SELECT * FROM candidates WHERE status IN ('Approved', 'Rejected')", (err, result) => {
        if (err) {
            console.error("Error fetching candidates history:", err);
            return res.status(500).json({ message: "Error fetching data" });
        }
        res.json(result); // ส่งข้อมูลผู้สมัครที่มีสถานะ Approved หรือ Rejected
    });
});

//----------------------------- CONDITION-------------------------
const fs = require('fs');

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

app.get('/api/election-results2', (req, res) => {
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
            AND v.candidate_type = 'Student council member (School of study)'
        WHERE c.candidate_type = 'Student council member (School of study)'
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




// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
