const bcrypt = require('bcrypt');
const User = require('../models/user');
const App = require('../models/app');
var async = require('async');

exports.user_create_post = async (req, res) =>{
  // Check if this user already exisits
  let user = await User.findOne({ email: req.body.email });
  if (user) {
      return res.status(400).send('That user already exists!');
  } else {
    // Insert the new user if they do not exist yet
      user = new User({
      uid: req.body.uid,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      admin: false,
      list_recommend:[],
      list_assign: [],
      list_remove: []
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    result = await user.save();
    res.send(result);
  }
};

exports.user_delete = async(req, res) => {
  try{
    var result = await User.deleteOne({uid: req.params.user_uid}).exec();
    res.send(result);
  }catch(error){
    res.status(500).send(error);
  }
};

exports.user_update_put = async(req, res) =>{
  try{
    var user = await User.find({uid: req.params.user_uid}).exec();
    user.set(req.body);
    var result = await user.save();
    res.send(result);
  }catch(error){
    res.status(500).send(error);
  }
};

// Display list of all Users.
exports.user_list = async (req, res) => {
  try{
    var result = await User.find().exec();
    res.send(result);
  }catch(error){
    res.status(500).send(error);
  }
};

exports.user_update_recommend = async (req, res) => {
  var app = App.findOne({appId: req.params.appId, title: req.body.title, icon: req.body.icon, url: req.body.url, description: req.body.description});
  User.updateOne({uid: req.params.user_uid},
    {$addToSet: { list_recommend: [ app ] } },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
};

exports.user_update_removed = async (req, res) => {
  var app = App.findOne({appId: req.params.appId, title: req.body.title, icon: req.body.icon, url: req.body.url, description: req.body.description});
  User.updateOne({uid: req.params.user_uid},
    {$addToSet: { list_remove: [ app ] } },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
};

exports.user_update_assigned = async (req, res) => {
  var app = App.findOne({appId: req.params.appId, title: req.body.title, icon: req.body.icon, url: req.body.url, description: req.body.description});
  User.updateOne({uid: req.params.user_uid},
    {$addToSet: { list_assign: [ app ] } },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
};

/*exports.user_delete_assigned = async (req, res) => {
  var app = App.findOne({appId: req.params.appId});
  User.updateOne({uid: req.params.user_uid},
    {$pop: { list_assign: [ app ] } },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
};*/
