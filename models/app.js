var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppSchema = new Schema(
  {
      icon: {type: String, required: true},
      url: {type: String, required: true},
      description: {type: String, required: true},
      appId: {type: String, required: true},
      title: {type: String, required: true},
      type: {type: String, required: false} // only used for list_assign
  }  
);

module.exports = mongoose.model('App', AppSchema);