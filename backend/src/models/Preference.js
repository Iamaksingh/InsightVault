const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    accentColor: { type: String, default: '#7c3aed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Preference', preferenceSchema);


