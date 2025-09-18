const express = require('express');
const { auth } = require('../middleware/auth');
const History = require('../models/History');

const router = express.Router();

// @route   POST api/history
// @desc    Save an outfit to history
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newHistory = new History({
      user: req.user.id,
      outfit: req.body.outfit,
    });
    const history = await newHistory.save();
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/history
// @desc    Get user's outfit history
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/history/:id
// @desc    Delete an outfit from history
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const historyItem = await History.findById(req.params.id);

        if (!historyItem) {
            return res.status(404).json({ msg: 'History item not found' });
        }

        // Ensure user owns the history item
        if (historyItem.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await historyItem.deleteOne();

        res.json({ msg: 'History item removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'History item not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;