const router = require('express').Router();
const Notification = require('../models/Notification');
const { pool } = require('../db/postgres');
const events = require('../events');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// US11 - Confirmation d'inscription, envoyee de facon asynchrone
// Le module "enrollments" emet un evenement puis repond tout de suite a l'etudiant.
function registerListeners() {
  events.on('enrollment.created', ({ userId, courseTitle }) => {
    setImmediate(async () => {
      try {
        const message = `Inscription confirmée au cours : ${courseTitle}`;
        await Notification.create({ userId, type: 'inscription', message });
        console.log(`[NOTIFICATION] utilisateur ${userId} : ${message}`);
      } catch (err) {
        console.error('Erreur notification', err);
      }
    });
  });

  // US05 - Prevenir les etudiants inscrits quand un cours est supprime
  events.on('course.deleted', async ({ courseId, title }) => {
    try {
      const { rows } = await pool.query('SELECT user_id FROM enrollments WHERE course_id = $1', [courseId]);
      for (const row of rows) {
        await Notification.create({
          userId: row.user_id,
          type: 'cours_supprime',
          message: `Le cours "${title}" a été supprimé par son formateur`,
        });
      }
      await pool.query('DELETE FROM enrollments WHERE course_id = $1', [courseId]);
    } catch (err) {
      console.error('Erreur notification de suppression', err);
    }
  });
}

// Mes notifications
router.get('/mine', authenticate, asyncHandler(async (req, res) => {
  const list = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(list);
}));

module.exports = { router, registerListeners };
