const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Student posts a question
const postQuestion = async (req, res) => {
  const { content, departmentId } = req.body;
  const userId = req.user.id;

  try {
    const question = await prisma.question.create({
      data: { content, departmentId, userId },
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post question', detail: err.message });
  }
};

// View all questions by department
const getQuestionsByDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const questions = await prisma.question.findMany({
      where: { departmentId: parseInt(departmentId) },
      include: { user: true },
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get questions', detail: err.message });
  }
};

// Dept admin answers a question
const answerQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { answer } = req.body;

  try {
    const updated = await prisma.question.update({
      where: { id: parseInt(questionId) },
      data: { answer },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update answer', detail: err.message });
  }
};

module.exports = {
  postQuestion,
  getQuestionsByDepartment,
  answerQuestion,
};
