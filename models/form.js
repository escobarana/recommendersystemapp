var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FormSchema = new Schema(
  {
    form_date: {type: Date, default:Date.now()},
    email: {type: String, required: true},
    age: {type: Number, required: true},
    gender: {type: String, required: true, enum: ['M','F']}, // Male or Female
    os: {type: String, required: true},
    answers: { type: Array }
  },
  { collection : 'patient_form' }
);

module.exports = mongoose.model('Form', FormSchema);