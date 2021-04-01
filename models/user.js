var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    admin: {type: Boolean, required: true, maxlength: 5, default: false}, // true or false
    name: {type: String, required: true, maxlength: 100},
    email: {type: String, required: true, unique: true}, // primaryKey
    password: {type: String, required: true},
    list_recommend: [{
      appId: {type: String},
      description: {type: String},  
      icon: {type: String},
      title: {type: String},
      url: {type: String}
    }],
    list_assign: [{
      appId: {type: String},
      description: {type: String},  
      icon: {type: String},
      title: {type: String},
      url: {type: String},
      type: {type: String}
    }], 
    list_remove: [{
      appId: {type: String},
      description: {type: String},  
      icon: {type: String},
      title: {type: String},
      url: {type: String}
    }],
    role: {type: String, default:"newbie"} // admin, reviewer, newbie
  },
  { collection : 'users' }
);

// Virtual for user's URL
//vUserSchema
// .virtual('url')
// .get(function () {
//   return '/api/user/' + this.uid;
// });

//Export model
module.exports = mongoose.model('User', UserSchema);