const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { port, adminEmail, adminPassword } = require('./config');
const { pool, initPostgres } = require('./db/postgres');
const { connectMongo } = require('./db/mongo');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Chaque module = une ligne. Si un module n'est pas encore ecrit, mettez sa ligne en commentaire (//).
app.use('/api/users', require('./modules/users'));
app.use('/api/courses', require('./modules/courses'));
app.use('/api/enrollments', require('./modules/enrollments'));
app.use('/api/notifications', require('./modules/notifications').router);
app.use('/api/stats', require('./modules/stats'));
require('./modules/notifications').registerListeners();

app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

app.use((err, req, res, next) => {
  if (err.code === '23505') return res.status(409).json({ error: 'Cette ressource existe déjà' });
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Cree le compte administrateur au premier demarrage (un admin ne peut pas s'inscrire seul)
async function seedAdmin() {
  if (!adminEmail || !adminPassword) return;
  const exists = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (exists.rows.length === 0) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ('Administrateur', $1, $2, 'admin')",
      [adminEmail, hash]
    );
    console.log('Compte admin créé :', adminEmail);
  }
}

async function start() {
  await initPostgres();
  console.log('PostgreSQL connecte, tables pretes');
  await connectMongo();
  await seedAdmin();
  app.listen(port, () => console.log(`API LearnHub sur le port ${port}`));
}

start().catch((err) => {
  console.error('Démarrage impossible', err);
  process.exit(1);
});
