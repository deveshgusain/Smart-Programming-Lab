const mongoose = require('mongoose');

const { Schema } = mongoose;

const questionModel = new Schema({
  questionNo: { type: Number },
  expectedDate: { type: String },
  topic: { type: String },
  timeLimit: { type: Number },
  description: { type: String },
  inputFormat: { type: String },
  outputFormat: { type: String },
  constrain: { type: Array },
  example: [
    {
      SampleInput: { type: Array },
      SampleOutput: { type: Array }
    }
  ],
  exampleExplain: { type: String },
  testCases:
    [
      {
        input: { type: String },
        output: { type: String }
      }
    ]
});

module.exports = mongoose.model('Question', questionModel);
