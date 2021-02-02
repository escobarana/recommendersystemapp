var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FormSchema = new Schema(
  {
    form_date: {type: Date, default:Date.now()},
    email: {type: String, required: true},
    age: {type: Number, required: true},
    gender: {type: String, required: true, enum: ['H','M']},
    weight: {type: Number, required: true},
    maritalstatus: {type: String, required: true, enum: ['Soltero','Casado','Divorciado','Separado','Viudo']},
    coexistence: {type: String, required: true, enum: ['Solo','Acompañado']},
    children: {type: String, required: true, enum: ['conHijos','sinHijos']},
    numChildren: {type: Number, required: false, default: 0},
    residence: {type: String, required: true},
    studies: {type: String, required: true, enum: ['Sin estudios', 'Estudios primarios (certificado de escolaridad)', 'Graduado escolar', 'Estudios secundarios o Bachillerato elemental',
                                                    'Bachillerato superior', 'Formación profesional (primer grado)', 'Formación profesional (segundo grado)', 'Diplomatura',
                                                    'Licenciatura', 'Doctorado']},
    work: {type: String, required: true, enum: ['Jornada completa', 'Jornada parcial', 'Desempleado', 'Jubilado', 'Estudiante']},
    level: {type: String, required: true, enum: ['Bajo','Alto', 'Moderado']},
    cancer: {type: String, required: true, enum: ['Cáncer de mama','Cáncer colorrectal']},
    elapsedTime: {type: String, required: true, enum: ['less1month','btw1and3months', 'btw3and6months', 'btw6andyear', 'btw1and3years', 'more3years']},
    treatment: {type: String, required: true, enum: ['treatment1','treatment2']}
  },
  { collection : 'patient_form' }
);

module.exports = mongoose.model('Form', FormSchema);