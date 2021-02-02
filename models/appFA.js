var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppFASchema = new Schema(
  {
      icon: {type: String, required: true},
      url: {type: String, required: true},
      description: {type: String, required: true},
      appId: {type: String, required: true},
      title: {type: String, required: true} 
  },
  { collection : 'apps_accepted' }
);

// Virtual for user's URL
/*AppFASchema
.virtual('url')
.get(function () {
  return '/api/appFA/' + this._id;
});*/

//Export model
module.exports = mongoose.model('AppFA', AppFASchema);