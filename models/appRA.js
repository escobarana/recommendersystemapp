var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppRASchema = new Schema(
  {
      icon: {type: String, required: true},
      url: {type: String, required: true},
      description: {type: String, required: true},
      appId: {type: String, required: true},
      title: {type: String, required: true} 
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