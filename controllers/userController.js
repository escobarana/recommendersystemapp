var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt.js');
const User = require('../models/user');
var async = require('async');

// register users
exports.user_create_post = async (req, res) =>{ 
  // Check if this user already exists
  let user = await User.findOne({ email: req.body.email }).exec();
  if (user !== null) {
      return res.status(400).send('That user already exists!');
  } else {
        user = new User({name: req.body.name,
                         email: req.body.email,
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

// login users
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

// update user information
exports.user_update = (req, res, next) =>{
  User.updateOne({ email: req.params.user_email }, 
    { $set: req.body }, {new:true}, function(error, data){
    if (error) {
      res.status(500).send(error);
      return next(error);
    } else {
      res.status(200).json(data);
    }
  })
};

// delete user
exports.user_delete = (req, res) => {
  User.findOneAndRemove({email: req.params.user_email}, (error, data) => {
    if (error) {
      res.status(500).json({ msg: error });
    } else {
      res.status(200).json({ msg: data });
    }
  }, {useFindAndModify: false})
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

// Returns a specific object.
exports.get_user = async (req, res) => {
  var userEmail = req.params.user_email;
  try{
    var result = await User.findOne({email: userEmail}).exec();
    res.status(200).send(result);
  }catch(error){
    res.status(500).send({ message: 'Error in the petition' });
  }
};

exports.user_update_recommend = async (req, res, next) => { // list_recommend
  User.findOneAndUpdate(
    { email : req.params.user_email },
    { $addToSet : { list_recommend: req.body } 
    },{new: true, upsert: true, safe: true, useFindAndModify: false},function(err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    }
  ).exec();
};

exports.user_update_removed = async (req, res, next) => { // list_removed
  User.findOneAndUpdate(
    { email : req.params.user_email },
    { $addToSet : { list_remove: req.body }
    },{new: true, upsert: true, safe: true, useFindAndModify: false},function(err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    }
  ).exec();
};

exports.user_update_assigned = async (req, res, next) => { // list_assigned
  User.findOneAndUpdate(
    { email : req.params.user_email },
    { $addToSet : { list_assign: req.body } 
    }, {new: true, upsert: true, safe: true, useFindAndModify: false}, function(err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    }
  ).exec();

};

exports.user_remove_assigned = function(req, res) {
  User.findOneAndUpdate(
      {email: req.params.user_email}, 
      { $pull : { list_assign: {appId: req.body.appId} }},
      {useFindAndModify: false}, function(err, result) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(result);
        }
  }).exec();
};
