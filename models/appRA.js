var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppRASchema = new Schema(
  {
    appId: {type: String},
    description: {type: String},  
    icon: {type: String},
    title: {type: String},
    url: {type: String},
    reviews: {type: Array}
  },
  { collection : 'apps_review_accept' }
);

// Virtual for user's URL
/*AppRASchema
.virtual('url')
.get(function () {
  return '/api/appRA/' + this._id;
});*/

//Export model
module.exports = mongoose.model('AppRA', AppRASchema);