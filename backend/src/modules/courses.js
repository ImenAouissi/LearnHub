const router = require('express').Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const { pool } = require('../db/postgres');
const events = require('../events');
const { authenticate, requireRole } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Charge le cours et vérifie que l'utilisateur connecté en est le propriétaire
const loadOwnedCourse = asyncHandler(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: 'Cours introuvable' });
  }
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Cours introuvable' });
  if (course.ownerId !== req.user.id) {
    return res.status(403).json({ error: "Vous n'êtes pas le propriétaire de ce cours" });
  }
  req.course = course;
  next();
});

// US07 - Catalogue (public) : sans le contenu des chapitres, avec leur nombre
router.get('/', asyncHandler(async (req, res) => {
  const match = req.query.category ? { category: req.query.category } : {};
  const courses = await Course.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        title: 1, description: 1, category: 1, ownerId: 1, ownerName: 1, createdAt: 1,
        chaptersCount: { $size: '$chapters' },
      },
    },
  ]);
  res.json(courses);
}));

// Liste des catégories existantes (pour les filtres du catalogue)
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Course.distinct('category');
  res.json(categories.filter(Boolean).sort());
}));

// US07 - Détail d'un cours avec ses chapitres (public)
router.get('/:id', asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ error: 'Cours introuvable' });
  }
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Cours introuvable' });
  res.json(course);
}));

// US04 - Créer un cours (formateur uniquement)
router.post('/', authenticate, requireRole('formateur'), asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Titre et description sont obligatoires' });
  }
  const { rows } = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
  const course = await Course.create({
    title, description, category, ownerId: req.user.id, ownerName: rows[0] ? rows[0].name : '',
  });
  res.status(201).json(course);
}));

// US05 - Modifier un cours (propriétaire uniquement)
router.put('/:id', authenticate, requireRole('formateur'), loadOwnedCourse, asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (title) req.course.title = title;
  if (description) req.course.description = description;
  if (category) req.course.category = category;
  await req.course.save();
  res.json(req.course);
}));

// US05 - Supprimer un cours (propriétaire uniquement)
router.delete('/:id', authenticate, requireRole('formateur'), loadOwnedCourse, asyncHandler(async (req, res) => {
  const { _id, title } = req.course;
  await req.course.deleteOne();
  events.emit('course.deleted', { courseId: String(_id), title }); // les inscrits seront informés
  res.json({ message: 'Cours supprimé' });
}));

// US06 - Ajouter un chapitre
router.post('/:id/chapters', authenticate, requireRole('formateur'), loadOwnedCourse, asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Titre et contenu du chapitre sont obligatoires' });
  }
  req.course.chapters.push({ title, content });
  await req.course.save();
  res.status(201).json(req.course);
}));

// Supprimer un chapitre
router.delete('/:id/chapters/:chapterId', authenticate, requireRole('formateur'), loadOwnedCourse, asyncHandler(async (req, res) => {
  const chapter = req.course.chapters.id(req.params.chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapitre introuvable' });
  chapter.deleteOne();
  await req.course.save();
  res.json(req.course);
}));

module.exports = router;
