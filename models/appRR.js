var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppRRSchema = new Schema(
  {
    appId: {type: String},
    description: {type: String},  
    icon: {type: String},
    title: {type: String},
    url: {type: String},
    reviews: {type: Array}
  },
  { collection : 'apps_review_remove' }
);

// Virtual for user's URL
/*AppRSSchema
.virtual('url')
.get(function () {
  return '/api/appRR/' + this._id;
});*/

//Export model
module.exports = mongoose.model('AppRR', AppRRSchema);