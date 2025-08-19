const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const supabase = require('../config/supabaseClient');

// POST Answer
router.post('/', verifyToken, async (req, res) => {
  const { questionId, answerText, answeredBy } = req.body;

  try {
    const { data, error } = await supabase
      .from('Answer')
      .insert([{ questionId, answerText, answeredBy }]);

    if (error) throw error;

    res.status(200).json({ msg: 'Answer posted successfully', data });
  } catch (err) {
    console.error('Error posting answer:', err);
    res.status(500).json({ msg: 'Failed to post answer', error: err.message });
  }
});

module.exports = router;
