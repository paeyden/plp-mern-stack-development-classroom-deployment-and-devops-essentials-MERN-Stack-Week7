const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.put('/:id', async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, avatar },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
