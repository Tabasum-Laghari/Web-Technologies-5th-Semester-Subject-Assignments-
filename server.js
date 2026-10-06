require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const Submission = require('./models/Submission');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

// ---------- File upload ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB

// ---------- Helpers ----------
const num = (v) => (v === undefined || v === '' ? undefined : Number(v));
const arr = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

// ---------- Routes ----------

// Create
app.post('/api/submissions', upload.single('file'), async (req, res) => {
  try {
    const b = req.body;
    const doc = new Submission({
      fullName: b.fullName,
      password: b.password ? await bcrypt.hash(b.password, 10) : undefined,
      email: b.email,
      age: num(b.age),
      phone: b.phone,
      website: b.website,
      search: b.search,
      dateOfBirth: b.dateOfBirth || undefined,
      time: b.time,
      dateTime: b.dateTime,
      month: b.month,
      week: b.week,
      gender: b.gender || '',
      skills: arr(b.skills),
      color: b.color,
      volume: num(b.volume),
      studentId: b.studentId,
      course: b.course || '',
      message: b.message,
      browser: b.browser,
      num1: num(b.num1),
      num2: num(b.num2),
      result: num(b.result),
      progress: num(b.progress),
      battery: num(b.battery),
      file: req.file
        ? { originalName: req.file.originalname, storedName: req.file.filename, size: req.file.size }
        : undefined,
    });

    // Validate first so we can return clean errors (password is hashed, so
    // enforce the minimum length on the raw value here)
    if (b.password && b.password.length < 6) {
      return res.status(400).json({ errors: ['Password must be at least 6 characters'] });
    }
    await doc.save();
    res.status(201).json({ message: 'Saved', id: doc._id });
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: Object.values(err.errors).map((e) => e.message) });
    }
    console.error(err);
    res.status(500).json({ errors: ['Server error'] });
  }
});

// Read all
app.get('/api/submissions', async (req, res) => {
  try {
    const items = await Submission.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ errors: ['Server error'] });
  }
});

// Read one
app.get('/api/submissions/:id', async (req, res) => {
  try {
    const item = await Submission.findById(req.params.id);
    if (!item) return res.status(404).json({ errors: ['Not found'] });
    res.json(item);
  } catch (err) {
    res.status(400).json({ errors: ['Invalid id'] });
  }
});

// Delete
app.delete('/api/submissions/:id', async (req, res) => {
  try {
    const item = await Submission.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ errors: ['Not found'] });
    if (item.file && item.file.storedName) {
      fs.unlink(path.join(UPLOAD_DIR, item.file.storedName), () => {});
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ errors: ['Invalid id'] });
  }
});

// Upload errors (e.g. file too large)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ errors: [err.message] });
  next(err);
});

// ---------- Start ----------
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/html5_form_db')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
