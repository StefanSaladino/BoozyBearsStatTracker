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
const authRouter = require('./routes/index');
const highlightRouter = require('./routes/highlights');
const Admin = require('./models/admin');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://boozybearsstattracker.web.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

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

mongoose.connect(globals.ConnectionString.MongoDB)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

const conn = mongoose.connection;
conn.once('open', () => {
  console.log('📡 Mongo connected');

  app.use('/players', playerRouter);
  app.use('/', authRouter);
  app.use('/api/videos', highlightRouter);

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

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

module.exports = { app, conn };
