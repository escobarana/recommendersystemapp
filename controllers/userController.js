var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt.js');
const User = require('../models/user');
var async = require('async');

exports.user_create_post = async (req, res) =>{
  // Check if this user already exists
  let user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user) {
      return res.status(400).send('That user already exists!');
  } else {
        user = new User({name: req.body.name,
                         email: req.body.email.toLowerCase(),
                         password: req.body.password
    });

    // encrypt password
    bcrypt.hash(req.body.password, null, null, function(err, hash){
      user.password = hash;

      // save user in the database
      user.save((err, userStored) => {
        if(err){
          res.status(500).send({message: 'Error saving the user'});
        }else{
          if(!userStored){
            res.status(404).send({message: 'User not registered'});
          }else{
            res.status(200).send({user: userStored});
          }
        }
      });   
    });
  }  
};

exports.user_login = async(req, res) => {
  var params = req.body; // get all data from the input

  var password = params.password;

  await User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
    if(err){
      res.status(500).send({message: 'Error checking the user'});
    }else{
      if(user){
        // decrypt password and compare the one introduced with the one in the database for the especified user
        bcrypt.compare(password, user.password, (err, check) => {
          if(check){ // correct
            // check and generate token JWT
            if(params.gettoken){ // if the token exists I return it
              res.status(200).send({token: jwt.createToken(user)});
            } else{
              res.status(200).send({user});
            }  
          }else{
            res.status(404).send({ message: 'The user could not log in correctly' });
          }
        });
      }else{
        res.status(404).send({ message: 'The user does not exist' });
      }
    }
  });
  
};

exports.user_update_put = async(req, res) =>{

  var userId = req.params.user_id;
  var update = req.body;

  delete update.password; // do not update the password

  if(userId!= req.user.sub){ // logged user
    return res.status(500).send({message: 'You do not have permission to update the user'});
  }

  User.findByIdAndUpdate(userId, update, { new:true }, (err, userUpdate) => { // {new:true} is for returning the new object (the updated one)
    if(err){
      return res.status(500).send({message: 'Error updating the user'});
    }else{
      if(!userUpdate){
        return res.status(404).send({message: 'User could not be updated'});
      }else{
        return res.status(200).send({message: 'User updated'});
      }
    }
  });

};

exports.user_delete = async(req, res) => {
  var userId = req.params.user_id;

  User.findByIdAndRemove(userId, (err, userRemove) => {
    if(err){
      res.status(500).send({messsage:'Error with the petition'});
    }else{
      if(!userRemove){
        res.status(404).send({message: 'The user is not removed'});
      }else
      res.status(200).send({user: userRemove});
    }
  });
};

// Display list of all Users.
exports.user_list = async (req, res) => {
  try{
    var result = await User.find().exec();
    res.status(200).send(result);
  }catch(error){
    res.status(500).send({ message: 'Error in the petition' });
  }
};

exports.user_update_recommend = async (req, res, next) => {
  var app = App.findOne({appId: req.params.app_appId, title: req.body.title, icon: req.body.icon, url: req.body.url, description: req.body.description});
  User.updateOne({_id: req.params.user_id},
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

exports.user_update_removed = async (req, res, next) => {
  var app = App.findOne({appId: req.params.app_appId, title: req.body.title, icon: req.body.icon, url: req.body.url, description: req.body.description});
  User.updateOne({id: req.params.user_id},
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

exports.user_update_assigned = async (req, res, next) => {
  var app = App.findOne({appId: req.params.app_appId, title: req.body.title, icon: req.body.icon, url: req.body.url, description: req.body.description});
  User.updateOne({id: req.params.user_id},
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

exports.user_remove_assigned = async (req, res) => {
  var app = App.findOne({appId: req.params.app_appId});
  User.updateOne({_id: req.params.user_id},
    {$pop: { list_assign: [ app ] } },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
};
