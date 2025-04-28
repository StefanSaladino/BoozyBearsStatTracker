const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');

const globals = require('./configs/globals');
const playerRouter = require('./routes/players');
const authRouter = require('./routes/index');
const highlightRouter = require('./routes/highlights');

const { initGridFS } = require('./middleware/gridFS');

// Auth middleware
const {
  loginLimiter,
  bruteForce,
  requireAdmin,
  authenticate,
  logout
} = require('./middleware/authMiddleware');

// Load Admin model
const Admin = require('./models/admin');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// MongoDB connection
mongoose.connect(globals.ConnectionString.MongoDB)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

const conn = mongoose.connection;

let upload; // Will be set after DB is open

conn.once('open', () => {
  console.log('📡 Mongo connected');
  initGridFS(conn);

  const { GridFsStorage } = require('multer-gridfs-storage');
  const storage = new GridFsStorage({
    url: globals.ConnectionString.MongoDB,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => ({
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'highlights',
      metadata: {
        description: req.body.description,
        gameDate: req.body.gameDate,
      },
      contentType: file.mimetype,
    }),
  });

  upload = multer({ storage });

  // Mount routes
  app.use('/players', playerRouter(upload));
  app.use('/', authRouter);
  app.use('/api/videos', highlightRouter(upload)); // Highlight video routes

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

app.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ message: 'Authenticated' });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.get('/', (req, res) => {
  res.send('🏒 Men\'s League Hockey Stats API is live');
});

module.exports = { app, conn };
