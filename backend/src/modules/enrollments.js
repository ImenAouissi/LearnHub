const router = require('express').Router();
const mongoose = require('mongoose');
const { pool } = require('../db/postgres');
const Course = require('../models/Course');
const events = require('../events');
const { authenticate, requireRole } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Recalcule le pourcentage de progression d'une inscription
async function updateProgress(enrollmentId, totalChapters) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS done FROM completed_chapters WHERE enrollment_id = $1',
    [enrollmentId]
  );
  const progress = totalChapters ? Math.round((rows[0].done * 100) / totalChapters) : 0;
  await pool.query('UPDATE enrollments SET progress = $1 WHERE id = $2', [progress, enrollmentId]);
  return progress;
}

// US08 - S'inscrire a un cours
router.post('/', authenticate, requireRole('etudiant'), asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ error: 'courseId invalide' });
  }
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ error: 'Cours introuvable' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING id, course_id, progress',
      [req.user.id, courseId]
    );
    // US11 - on previent le module de notification sans l'attendre
    events.emit('enrollment.created', { userId: req.user.id, courseTitle: course.title });
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Vous êtes déjà inscrit à ce cours' });
    }
    throw err;
  }
}));

// US09 - Mes cours avec ma progression
router.get('/mine', authenticate, requireRole('etudiant'), asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, course_id, progress FROM enrollments WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  const courses = await Course.find({ _id: { $in: rows.map((r) => r.course_id) } });
  const done = await pool.query(
    'SELECT enrollment_id, chapter_id FROM completed_chapters WHERE enrollment_id = ANY($1::int[])',
    [rows.map((r) => r.id)]
  );
  const result = rows.map((enr) => {
    const course = courses.find((c) => String(c._id) === enr.course_id);
    const doneIds = done.rows.filter((d) => d.enrollment_id === enr.id).map((d) => d.chapter_id);
    return {
      enrollmentId: enr.id,
      courseId: enr.course_id,
      title: course ? course.title : '(cours supprimé)',
      category: course ? course.category : '',
      ownerName: course ? course.ownerName : '',
      progress: enr.progress,
      chapters: course
        ? course.chapters.map((ch) => ({ id: String(ch._id), title: ch.title, done: doneIds.includes(String(ch._id)) }))
        : [],
    };
  });
  res.json(result);
}));

// US09 - Marquer un chapitre comme termine
router.post('/:courseId/chapters/:chapterId/complete', authenticate, requireRole('etudiant'), asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const enr = await pool.query('SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2', [req.user.id, courseId]);
  if (!enr.rows[0]) return res.status(404).json({ error: "Vous n'êtes pas inscrit à ce cours" });
  const course = mongoose.isValidObjectId(courseId) ? await Course.findById(courseId) : null;
  const chapter = course && course.chapters.id(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapitre introuvable' });
  await pool.query(
    'INSERT INTO completed_chapters (enrollment_id, chapter_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [enr.rows[0].id, chapterId]
  );
  const progress = await updateProgress(enr.rows[0].id, course.chapters.length);
  res.json({ progress });
}));

module.exports = router;
