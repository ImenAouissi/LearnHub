const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/postgres');
const { jwtSecret } = require('../config');
const { authenticate, requireRole } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// US01 - Creer un compte
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nom, email et mot de passe sont obligatoires' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
  }
  if (!['etudiant', 'formateur'].includes(role)) {
    return res.status(400).json({ error: 'Le rôle doit être étudiant ou formateur' });
  }
  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (exists.rows.length > 0) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé' });
  }
  const hash = await bcrypt.hash(password, 10); // mot de passe hache (bcrypt)
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hash, role]
  );
  res.status(201).json(rows[0]);
}));

// US02 - Se connecter (renvoie un token JWT)
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  const ok = user && (await bcrypt.compare(password || '', user.password_hash));
  if (!ok) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, jwtSecret, { expiresIn: '4h' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}));

// US03 - Consulter son profil
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
  res.json(rows[0]);
}));

// US03 - Modifier son profil
router.put('/me', authenticate, asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nom et email sont obligatoires' });
  const other = await pool.query('SELECT id FROM users WHERE email = $1 AND id <> $2', [email, req.user.id]);
  if (other.rows.length > 0) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé par un autre compte' });
  }
  const { rows } = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role',
    [name, email, req.user.id]
  );
  res.json(rows[0]);
}));

// US10 - Lister les utilisateurs (admin), filtre ?role=etudiant
router.get('/', authenticate, requireRole('admin'), asyncHandler(async (req, res) => {
  const { role } = req.query;
  const { rows } = role
    ? await pool.query('SELECT id, name, email, role FROM users WHERE role = $1 ORDER BY id', [role])
    : await pool.query('SELECT id, name, email, role FROM users ORDER BY id');
  res.json(rows);
}));

module.exports = router;
