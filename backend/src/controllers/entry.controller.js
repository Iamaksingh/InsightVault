const Entry = require('../models/Entry');

async function list(req, res) {
  try {
    const { category, q } = req.query;
    const filter = { userId: req.user.userId };
    if (category) filter.category = category;
    if (q) {
      const regex = new RegExp(String(q), 'i');
      filter.$or = [{ title: regex }, { description: regex }, { tags: regex }];
    }
    const entries = await Entry.find(filter).sort({ updatedAt: -1 });
    res.json(entries);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
}

async function create(req, res) {
  try {
    const { title, description, category, tags, link } = req.body;
    const created = await Entry.create({ userId: req.user.userId, title, description, category, tags, link });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: 'Failed to create entry' });
  }
}

async function update(req, res) {
  try {
    const updated = await Entry.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update entry' });
  }
}

async function remove(req, res) {
  try {
    const deleted = await Entry.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Failed to delete entry' });
  }
}

module.exports = { list, create, update, remove };


