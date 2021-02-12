var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppSchema = new Schema(
  {
    appId: {type: String, required: true},
    description: {type: String, required: true},  
    icon: {type: String, required: true},
    title: {type: String, required: true},
    url: {type: String, required: true},
    reviews: {type: Array, default: []}
  }  
);

module.exports = mongoose.model('App', AppSchema);