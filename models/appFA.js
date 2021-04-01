var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppFASchema = new Schema(
  {
    appId: {type: String},
    description: {type: String},  
    icon: {type: String},
    title: {type: String},
    url: {type: String},
    reviews: {type: Array}
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