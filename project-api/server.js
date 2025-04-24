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
const passport = require('passport');

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

// Load Admin model with passport-local-mongoose
const Admin = require('./models/admin'); // Make sure you create this model

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true // allow cookies/sessions
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // set to true in production
    sameSite: 'lax', // allows cross-origin requests from same-site (good default)
  },
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport-local-mongoose strategy
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// MongoDB connection
mongoose.connect(globals.ConnectionString.MongoDB)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

const conn = mongoose.connection;

// GridFS setup
let gfs;
conn.once('open', () => {
  console.log('📡 Mongo connected');

  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'highlights',
  });

  console.log('🎥 GridFS bucket ready');
});

// GridFsStorage setup with direct connection
const storage = new GridFsStorage({
  url: globals.ConnectionString.MongoDB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'highlights',
      metadata: {
        description: req.body.description,
        gameDate: req.body.gameDate,
      },
      contentType: file.mimetype
    };
  },
});
const upload = multer({ storage });

// Serve video stream by filename
app.get('/api/videos/:filename', async (req, res) => {
  try {
    const file = await conn.db.collection('highlights.files').findOne({ filename: req.params.filename });

    if (!file) return res.status(404).json({ error: 'File not found' });

    if (!file.contentType || !file.contentType.startsWith('video/')) {
      return res.status(400).json({ error: 'Not a video file' });
    }

    res.set('Content-Type', file.contentType);
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');

    const readStream = gfs.openDownloadStreamByName(req.params.filename);
    readStream.pipe(res);

    readStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).end();
    });
  } catch (err) {
    console.error('❌ Video stream error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ message: 'Authenticated' });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Routes
app.use('/players', playerRouter(upload));
app.use('/', authRouter);

app.get('/', (req, res) => {
  res.send('🏒 Men\'s League Hockey Stats API is live');
});

// Export app and Mongo connection for tests
module.exports = { app, conn };

// Only start server if file is run directly (not imported by test)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
