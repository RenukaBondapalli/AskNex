const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'asknex_secret';

// Middleware to extract user info from token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ msg: 'Invalid token' });
  }
};

// GET all departments (used for /api/departments/)
router.get('/', async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching departments', error: err.message });
  }
});

// GET departments based on user role (used for /api/departments/view)
router.get('/view', authenticate, async (req, res) => {
  const { role, id } = req.user;

  try {
    if (role === 'admin' || role === 'student') {
      const departments = await prisma.department.findMany();
      return res.json(departments);
    } else if (role === 'dept_admin') {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { department: true },
      });

      if (!user?.department) {
        return res.status(404).json({ msg: 'Department not assigned' });
      }

      return res.json([user.department]);
    } else {
      return res.status(403).json({ msg: 'Unauthorized role' });
    }
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch departments', error: err.message });
  }
});

module.exports = router;
