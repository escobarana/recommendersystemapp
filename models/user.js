var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/*var AppSchema = new Schema(
  {
      icon: {type: String, required: true},
      url: {type: String, required: true},
      description: {type: String, required: true},
      appId: {type: String, required: true},
      title: {type: String, required: true},
      type: {type: String, required: false} // only used for list_assign
  }  
);

mongoose.model('App', AppSchema);*/

var UserSchema = new Schema(
  {
    admin: {type: Boolean, required: true, maxlength: 5}, // "true" or "false"
    name: {type: String, required: true, maxlength: 100},
    uid: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    list_recommend: {type: Array, ref: 'App'}, // Array of subdocuments
    list_assign: {type: Array, ref: 'App'}, // Array of subdocuments
    list_remove: {type: Array, ref: 'App'} //[{type: Schema.ObjectId, ref: 'App'}] // Array of subdocuments
  },
  { collection : 'users' }
);

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/api/user/' + this.uid;
});

//Export model
module.exports = mongoose.model('User', UserSchema);