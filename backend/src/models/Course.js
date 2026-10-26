const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General', trim: true },
    ownerId: { type: Number, required: true }, // id du formateur dans PostgreSQL
    ownerName: { type: String, default: '' }, // copie du nom, pour l'afficher sans appeler PostgreSQL
    chapters: [chapterSchema], // les chapitres restent dans l'ordre de creation
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
