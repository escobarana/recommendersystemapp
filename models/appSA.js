var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppSASchema = new Schema(
  {
    appId: {type: String, required: true},
    description: {type: String, required: true},  
    icon: {type: String, required: true},
    title: {type: String, required: true},
    url: {type: String, required: true},
    reviews: {type: Number},
    supportedDevices: {type: Array },
    contentRating: {type: String},
    currentVersionReviews: {type: Number},
    released: {type: String},
    version: {type: String},
    primaryGenreId: {type: Number},
    free: {type: Boolean},
    developerId: {type: Number},
    score: {type: Number},
    appletvScreenshots: {type: Array},
    price: {type: Number},
    developer: {type: String},
    id: {type: Number},
    screenshots: {type: Array},
    ipadScreenshots: {type: Array},
    size: {type: String},
    genreIds: {type: Array},
    languages: {type: Array},
    currency: {type: String},
    releaseNotes: {type: String},
    developerWebsite: {type: String},
    primaryGenre: {type: String},
    updated: {type: String},
    developerUrl: {type: String},
    currentVersionScore: {type: Number},
    requiredOsVersion: {type: String},
    genres: {type: Array}
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