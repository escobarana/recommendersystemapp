var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppSRSchema = new Schema(
  {
    appId: {type: String, required: true},
    description: {type: String, required: true},  
    icon: {type: String, required: true},
    title: {type: String, required: true},
    url: {type: String, required: true},
    reviews: {type: Array, default: []}
  },
  { collection : 'system_apps_remove' }
);

// Virtual for user's URL
/*AppSRSchema
.virtual('url')
.get(function () {
  return '/api/appSR/' + this._id;
});*/

//Export model
module.exports = mongoose.model('AppSR', AppSRSchema);