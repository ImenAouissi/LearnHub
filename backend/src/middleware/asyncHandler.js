// Express 4 n'attrape pas les erreurs des fonctions async : on les transmet nous-memes.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
