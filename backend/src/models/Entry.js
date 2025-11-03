const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    link: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Entry', entrySchema);


