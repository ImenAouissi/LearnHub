const { Pool } = require('pg');
const { databaseUrl } = require('../config');

const pool = new Pool({ connectionString: databaseUrl });

async function initPostgres() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(100) NOT NULL,
      email         VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(100) NOT NULL,
      role          VARCHAR(20)  NOT NULL CHECK (role IN ('etudiant', 'formateur', 'admin')),
      created_at    TIMESTAMP DEFAULT NOW()
    )`);

  // course_id est l'identifiant d'un cours stocke dans MongoDB :
  // pas de cle etrangere possible entre deux bases differentes.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id  VARCHAR(30) NOT NULL,
      progress   INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, course_id)
    )`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS completed_chapters (
      enrollment_id INTEGER NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
      chapter_id    VARCHAR(30) NOT NULL,
      PRIMARY KEY (enrollment_id, chapter_id)
    )`);
}

module.exports = { pool, initPostgres };
