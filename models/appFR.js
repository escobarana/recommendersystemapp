var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppFRSchema = new Schema(
  {
    appId: {type: String, required: true},
    description: {type: String, required: true},  
    icon: {type: String, required: true},
    title: {type: String, required: true},
    url: {type: String, required: true},
    reviews: {type: Array, default: []}
  },
  { collection : 'apps_removed' }
);

// Virtual for user's URL
/*AppFRSchema
.virtual('url')
.get(function () {
  return '/api/appFR/' + this._id;
});*/

//Export model
module.exports = mongoose.model('AppFR', AppFRSchema);