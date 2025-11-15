import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
const PORT = 5000;

// ========================== MIDDLEWARE ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ========================== DATABASE CONNECTION ==========================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tagnav",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});

// ========================== MULTER SETUP ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ========================== DOG ROUTES ==========================

// 🐕 Add Dog
app.post("/api/dogs", upload.single("image"), (req, res) => {
  const { name, breed, age, description, available_for_adoption } = req.body;

  console.log("📩 Received data:", req.body);
  console.log("📸 Received file:", req.file);

  if (!name || !breed || !age || !description) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const image_url = req.file ? req.file.filename : "default.jpg";

  const sql = `
    INSERT INTO dogs (name, breed, age, description, available_for_adoption, image_url) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, breed, age, description, available_for_adoption, image_url], (err) => {
    if (err) {
      console.error("🔴 MySQL Dog Insertion Error:", err);
      return res.status(500).json({ error: "Failed to add dog" });
    }
    res.json({ success: true, message: "✅ Dog added successfully!" });
  });
});

// 🐾 Get all dogs
app.get("/api/dogs", (req, res) => {
  const sql = "SELECT * FROM dogs";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch dogs" });
    res.json(results);
  });
});

// ✏️ Update dog
app.put("/api/dogs/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, breed, age, description, available_for_adoption } = req.body;
  const image_url = req.file ? req.file.filename : null;

  let sql, params;
  if (image_url) {
    sql = `UPDATE dogs SET name=?, breed=?, age=?, description=?, available_for_adoption=?, image_url=? WHERE id=?`;
    params = [name, breed, age, description, available_for_adoption, image_url, id];
  } else {
    sql = `UPDATE dogs SET name=?, breed=?, age=?, description=?, available_for_adoption=? WHERE id=?`;
    params = [name, breed, age, description, available_for_adoption, id];
  }

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: "Failed to update dog" });
    res.json({ success: true, message: "Dog updated successfully!" });
  });
});

// 🗑️ Delete dog
app.delete("/api/dogs/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM dogs WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete dog" });
    res.json({ success: true, message: "Dog deleted successfully!" });
  });
});

// ✅ Mark dog as adopted
app.put("/api/dogs/:id/adopt", (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE dogs SET available_for_adoption = 0 WHERE id = ?`;
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: "Dog marked as adopted" });
  });
});

// ========================== ADOPTION REQUESTS ==========================
app.post("/api/adopt", (req, res) => {
  const { name, age, address, occupation, email, phone, message, dog_id } = req.body;

  const sql = `
    INSERT INTO \`adoption_requests\` 
    (name, age, address, occupation, email, phone, message, dog_id, request_date, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'pending')
  `;
  db.query(sql, [name, age, address, occupation, email, phone, message, dog_id], (err) => {
    if (err) return res.status(500).json({ success: false, error: "Database error" });
    res.json({ success: true, message: "Adoption request submitted" });
  });
});

app.get("/api/requests", (req, res) => {
  const sql = `
    SELECT ar.*, d.name AS dog_name 
    FROM \`adoption_requests\` ar 
    LEFT JOIN dogs d ON ar.dog_id = d.id
    ORDER BY ar.id DESC
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json(data);
  });
});


app.put("/api/requests/:id/approve", (req, res) => {
  const { id } = req.params;

  // First, get the dog_id of this request
  const getDogIdSql = "SELECT dog_id FROM adoption_requests WHERE id = ?";
  db.query(getDogIdSql, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (result.length === 0) return res.status(404).json({ success: false, error: "Request not found" });

    const dogId = result[0].dog_id;

    // Update the adoption request status
    const updateRequestSql = "UPDATE adoption_requests SET status='approved' WHERE id=?";
    db.query(updateRequestSql, [id], (err2) => {
      if (err2) return res.status(500).json({ success: false, error: err2.message });

      // Mark the dog as adopted
      const updateDogSql = "UPDATE dogs SET available_for_adoption=0 WHERE id=?";
      db.query(updateDogSql, [dogId], (err3) => {
        if (err3) return res.status(500).json({ success: false, error: err3.message });

        res.json({ success: true, message: "Request approved and dog marked as adopted" });
      });
    });
  });
});

app.delete("/api/requests/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM \`adoption_requests\` WHERE id=?`;
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true });
  });
});

// ========================== ADMIN LOGIN ==========================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, data) => {
    if (err) {
      console.error("Login DB Error:", err);
      return res.status(500).json({ success: false, message: "Server error during login." });
    }

    if (data.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid username or password." });
    }

    const user = data[0];

    if (user.password === password) {
      return res.json({
        success: true,
        message: "Login successful",
        ...user,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid username or password." });
    }
  });
});

// ========================== SERVER START ==========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
