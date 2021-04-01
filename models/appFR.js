var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppFRSchema = new Schema(
  {
    appId: {type: String},
    description: {type: String},  
    icon: {type: String},
    title: {type: String},
    url: {type: String},
    reviews: {type: Array}
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