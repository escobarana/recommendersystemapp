var AppSA = require('../models/appSA');
var AppSR = require('../models/appSR');
var AppRA = require('../models/appRA');
var AppRR = require('../models/appRR');
var AppFA = require('../models/appFA');
var AppFR = require('../models/appFR');

var async = require('async');

// Display list of accepted apps by the system.
exports.getSystemAccept = async (req, res) => {
    try{
        var result = await AppSA.find().exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_system_apps_accept = async (req, res) => {
    try{
        let exist = AppSA.findOne({appId: req.body.appId}).exec();
        if(exist === null){ // it does not exist in the collection
            let app = new AppSA(req.body);
            if(app !== null){
                app.save((err, appStored) => {
                    if(err){
                    res.status(500).send({message: 'Error saving the app'});
                    }else{
                    if(!appStored){
                        res.status(404).send({message: 'App not saved yet ...'});
                    }else{
                        res.status(200).send({app: appStored});
                    }
                    }
                });
            }   
        }else{
            res.send.status(500).send({msg: 'That app already exists'});
        }
    }catch(err){
        res.status(500).send(err);
    }

};

// Display list of removed apps by the system.
exports.getSystemRemove = async (req, res) => {
    try{
        var result = await AppSR.find().exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_system_apps_remove = async (req, res) => {
    try{
        let exist = AppSR.findOne({appId: req.body.appId}).exec();
        if(exist === null){ // it does not exist in the collection
            let app = new AppSR(req.body);
            if(app !== null){
                app.save((err, appStored) => {
                    if(err){
                    res.status(500).send({message: 'Error saving the app'});
                    }else{
                    if(!appStored){
                        res.status(404).send({message: 'App not saved yet ...'});
                    }else{
                        res.status(200).send({app: appStored});
                    }
                    }
                });
            } 
        }
    }catch(err){
        res.status(500).send(err);
    }
    
};

// Display list of reviewed accepted apps.
exports.getReviewAccept = async (req, res) => {
    try{
        var result = await AppRA.find().exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_apps_review_accept = async (req, res) => {
    let app = new AppRA({
        appId: req.body.appId,
        title: req.body.title,
        description: req.body.description,
        icon:req.body.icon,
        url:req.body.url,
        reviews: req.body.review});
    // save app in the database
    app.save((err, appStored) => {
        if(err){
        res.status(500).send({message: 'Error saving the app'});
        }else{
        if(!appStored){
            res.status(404).send({message: 'App not registered'});
        }else{
            res.status(200).send({app: appStored});
        }}
    });
};

exports.delete_review_accept = async (req, res) => {
    try{
        var result = AppRA.findOneAndDelete({appId: req.params.app_appId}, {useFindAndModify: false}).exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

// Display list of reviewed removed apps.
exports.getReviewRemove = async (req, res) => {
    try{
        var result = await AppRR.find().exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_apps_review_remove = async (req, res) => {
    let app = new AppRR({
        appId: req.body.appId,
        title: req.body.title,
        description: req.body.description,
        icon:req.body.icon,
        url:req.body.url,
        reviews: req.body.review});
    // save app in the database
    app.save((err, appStored) => {
        if(err){
        res.status(500).send({message: 'Error saving the app'});
        }else{
        if(!appStored){
            res.status(404).send({message: 'App not registered'});
        }else{
            res.status(200).send({app: appStored});
        }}
    });
};

exports.delete_review_remove = async(req, res)=>{
    try{
        var result = await AppRR.findOneAndDelete({appId: req.params.app_appId}, {useFindAndModify: false}).exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

// Display list of final accepted apps.
exports.getFinalAccept = async (req, res) => {
    try{
        var result = await AppFA.find().exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_apps_accepted = async (req, res) => {
    try{
        app = new AppFA(req.body);
        result = await app.save();
        res.status(200).send(result);
    }catch(err){
        res.status(500).send(err);
    }
    
};

exports.delete_final_accept = async(req, res)=>{
    try{
        var result = await AppFA.findOneAndDelete({appId: req.params.app_appId}, {useFindAndModify: false}).exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

// Display list of final removed apps.
exports.getFinalRemove = async (req, res) => {
    try{
        var result = await AppFR.find().exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_apps_removed = async (req, res) => {
    try{
        app = new AppFR(req.body);
        result = await app.save();
        res.status(200).send(result);
    }catch(err){
        res.status(500).send(err);
    }
};

exports.delete_final_remove = async(req, res)=>{
    try{
        var result = await AppFR.findOneAndDelete({appId: req.params.app_appId}, {useFindAndModify: false}).exec();
        res.status(200).send(result);
    }catch(error){
        res.status(500).send(error);
    }
};
