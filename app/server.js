require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/User');
const patronesRoutes = require('./routes/patrones');
const { requireLogin } = require('./middleware/auth');

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { autoIndex: true })
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB', err));

// Middlewares
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatarUrl = profile.photos?.[0]?.value;
        let user = await User.findOne({ providerId: profile.id });
        if (!user) {
          user = await User.create({
            providerId: profile.id,
            email,
            displayName: profile.displayName,
            avatarUrl,
            plan: 'free',
          });
        } else {
          user.email = user.email || email;
          user.displayName = user.displayName || profile.displayName;
          user.avatarUrl = avatarUrl || user.avatarUrl;
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/?auth=fail` }),
  (req, res) => res.redirect(`${FRONTEND_URL}/editor/tapestry`),
);

app.post('/api/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  });
});

app.get('/api/current_user', (req, res) => {
  if (!req.user) return res.status(401).json(null);
  const { _id, email, displayName, avatarUrl, plan } = req.user;
  return res.json({ _id, email, displayName, avatarUrl, plan });
});

// API routes
app.use('/api/patrones', requireLogin, patronesRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
