const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// moved auth, controllers, and models into src/

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mongo Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/insightvault';
mongoose
  .connect(mongoUri, { dbName: 'insightvault' })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Models moved out of this file

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', require('./src/routes/auth.routes'));

app.use('/api/entries', require('./src/routes/entry.routes'));

// Preferences
app.use('/api/preferences', require('./src/routes/preference.routes'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));


