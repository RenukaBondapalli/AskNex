const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const supabase = require('../config/supabaseClient');

// 📥 POST a new question
router.post('/', verifyToken, async (req, res) => {
  const { departmentId, question } = req.body;
  const userId = req.user.id;

  const payload = {
    content: question,
    departmentId,
    userId,
  };

  try {
    const { data, error } = await supabase
      .from('Question')  
      .insert([payload])
      .select(); // ✅ Return inserted row

    if (error) return res.status(500).json({ msg: 'Failed to post question', error });

    res.status(200).json({ msg: 'Question posted successfully', data });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// 📤 GET questions by department ID with their answers
router.get('/:departmentId', verifyToken, async (req, res) => {
  const departmentId = req.params.departmentId;

  try {
    const { data, error } = await supabase
      .from('Question')
      .select(`
        id,
        content,
        userId,
        departmentId,
        createdAt,
        answers:Answer (
          id,
          answerText,
          answeredBy,
          createdAt
        )
      `) // ✅ join answers
      .eq('departmentId', departmentId);

    if (error) {
      console.error('🔥 Supabase fetch error:', error);
      return res.status(500).json({ msg: 'Failed to fetch questions', error });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('🔥 Error in GET /api/questions/:id:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


// 🧾 GET answers for a specific question
router.get('/:questionId/answers', verifyToken, async (req, res) => {
  const { questionId } = req.params;

  try {
    const { data, error } = await supabase
      .from('Answer')
      .select('*')
      .eq('questionId', questionId);

    if (error) {
      console.error('🔥 Supabase fetch error (answers):', error);
      return res.status(500).json({ msg: 'Failed to fetch answers', error });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('🔥 Error in GET /api/questions/:id/answers:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
