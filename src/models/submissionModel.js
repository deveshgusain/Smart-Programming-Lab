const mongoose = require('mongoose');

const { Schema } = mongoose;

const submissionModel = new Schema({
  time: { type: String },
  code: { type: String },
  language: { type: String },
  score: { type: Number, default: 0 },
  result: { type: String },
  questionId: { type: String },
  userId: { type: String }
});

module.exports = mongoose.model('Submission', submissionModel);
