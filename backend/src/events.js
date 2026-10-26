const { EventEmitter } = require('events');

// Un "bus" d'evenements interne au monolithe.
// Les modules s'envoient des messages sans s'appeler directement.
module.exports = new EventEmitter();
