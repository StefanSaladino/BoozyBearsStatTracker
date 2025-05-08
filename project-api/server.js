// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const globals = require('./configs/globals');
const playerRouter = require('./routes/players');
const authRouter   = require('./routes/index');
const highlightRouter = require('./routes/highlights');
const Admin       = require('./models/admin');

dotenv.config();

const app = express();

// 1) CORS + security middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://boozybearsstattracker.web.app',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

// 2) Session / Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// 3) Mount your routers *immediately*, so they're always active
app.use('/players', playerRouter);
app.use('/',      authRouter);
app.use('/api/videos', highlightRouter);

app.get('/auth/status', (req, res) => {
  res.status(req.isAuthenticated() ? 200 : 401)
     .json({ message: req.isAuthenticated() ? 'Authenticated' : 'Not authenticated' });
});

// 4) Health check
app.get('/', (req, res) => {
  res.send("🏒 Men's League Hockey Stats API is live");
});

// 5) Connect to Mongo & then start listening
mongoose.connect(globals.ConnectionString.MongoDB)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });

module.exports = app;
