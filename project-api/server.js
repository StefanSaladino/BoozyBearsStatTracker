const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const { GridFsStorage } = require('multer-gridfs-storage');

const globals = require('./configs/globals');
const playerRouter = require('./routes/players');
const authRouter = require('./routes/index'); // Handles login/logout/dashboard

// Auth middleware
const {
  loginLimiter,
  bruteForce,
  requireAdmin,
  authenticate,
  logout
} = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// MongoDB connection
mongoose.connect(globals.ConnectionString.MongoDB)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// GridFS Setup
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'highlights'
  });
  console.log('🎥 GridFS bucket ready');
});

// GridFS Storage for Multer
const storage = new GridFsStorage({
  url: process.env.CONNECTION_STRING_MONGODB,
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: 'highlights'
  })
});
const upload = multer({ storage });

// Routes
app.use('/players', playerRouter(upload));
app.use('/', authRouter);

app.get('/', (req, res) => {
  res.send('🏒 Men\'s League Hockey Stats API is live');
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
