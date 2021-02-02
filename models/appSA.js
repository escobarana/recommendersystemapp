var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppSASchema = new Schema(
  {
      icon: {type: String, required: true},
      url: {type: String, required: true},
      description: {type: String, required: true},
      appId: {type: String, required: true},
      title: {type: String, required: true} 
  },
  { collection : 'system_apps_accept' }
);

// Virtual for app's URL
/*AppSASchema
.virtual('url')
.get(function () {
  return '/api/apps/appSA/' + this._id;
});*/

//Export model
module.exports = mongoose.model('AppSA', AppSASchema);