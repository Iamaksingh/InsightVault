const Preference = require('../models/Preference');

async function getPreferences(req, res) {
  try {
    const pref = await Preference.findOne({ userId: req.user.userId });
    res.json(pref || { userId: req.user.userId, theme: 'system', accentColor: '#7c3aed' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
}

async function updatePreferences(req, res) {
  try {
    const { theme, accentColor } = req.body;
    const pref = await Preference.findOneAndUpdate(
      { userId: req.user.userId },
      { theme, accentColor },
      { upsert: true, new: true }
    );
    res.json(pref);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update preferences' });
  }
}

module.exports = { getPreferences, updatePreferences };


