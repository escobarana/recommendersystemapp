var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppRRSchema = new Schema(
  {
      icon: {type: String, required: true},
      url: {type: String, required: true},
      description: {type: String, required: true},
      appId: {type: String, required: true},
      title: {type: String, required: true}
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