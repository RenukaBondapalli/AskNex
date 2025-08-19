const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ msg: 'Failed to fetch departments' });
  }
};

module.exports = {
  getDepartments,
};
