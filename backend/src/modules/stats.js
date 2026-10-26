const router = require('express').Router();
const { pool } = require('../db/postgres');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Chiffres du tableau de bord, adaptés au rôle de l'utilisateur connecté
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const { id, role } = req.user;

  if (role === 'etudiant') {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS enrolled,
              COUNT(*) FILTER (WHERE progress = 100)::int AS completed,
              COALESCE(ROUND(AVG(progress)), 0)::int AS average
       FROM enrollments WHERE user_id = $1`,
      [id]
    );
    const notifications = await Notification.countDocuments({ userId: id });
    return res.json({ role, ...rows[0], notifications });
  }

  if (role === 'formateur') {
    const courses = await Course.find({ ownerId: id }).select('chapters');
    const ids = courses.map((c) => String(c._id));
    const chapters = courses.reduce((sum, c) => sum + c.chapters.length, 0);
    const { rows } = await pool.query(
      'SELECT COUNT(DISTINCT user_id)::int AS students FROM enrollments WHERE course_id = ANY($1::text[])',
      [ids]
    );
    return res.json({ role, courses: courses.length, chapters, students: rows[0].students });
  }

  // admin
  const users = await pool.query('SELECT role, COUNT(*)::int AS n FROM users GROUP BY role');
  const byRole = { etudiant: 0, formateur: 0, admin: 0 };
  users.rows.forEach((r) => { byRole[r.role] = r.n; });
  const enrollments = await pool.query('SELECT COUNT(*)::int AS n FROM enrollments');
  const courses = await Course.countDocuments();
  res.json({
    role,
    users: byRole.etudiant + byRole.formateur + byRole.admin,
    students: byRole.etudiant,
    teachers: byRole.formateur,
    courses,
    enrollments: enrollments.rows[0].n,
  });
}));

module.exports = router;
