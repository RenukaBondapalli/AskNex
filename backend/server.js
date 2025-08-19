const express = require('express');
const cors = require('cors');
const { supabase } = require('./config/supabaseClient'); 
const verifyToken = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('AskNex API running ✅');
});

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ msg: `Hello ${req.user.role}, you are authenticated!` });
});

const departmentRoutes = require('./routes/departmentRoutes');
app.use('/api/departments', departmentRoutes);

const questionRoutes = require('./routes/questionRoutes');
app.use('/api/questions', questionRoutes);

app.use('/api/answers', require('./routes/answerRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
