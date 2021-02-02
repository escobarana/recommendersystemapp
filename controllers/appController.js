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
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_system_apps_accept = async (req, res) => {
    // Check if this app already exisits
    let app = await AppSA.findOne({ appId: req.params.app_appId });
    if (app) {
        return res.status(400).send('That app already exists!');
    } else {
        // Insert the new app if it does not exist yet
        app = new AppSA({
            icon: req.body.icon,
            url: req.body.url,
            description: req.body.description,
            appId: req.params.app_appId,
            title: req.body.title
        });
        result = await app.save();
        res.send(result);
    }
}

// Display list of removed apps by the system.
exports.getSystemRemove = async (req, res) => {
    try{
        var result = await AppSR.find().exec();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_system_apps_remove = async (req, res) => {
    // Check if this app already exisits
    let app = await AppSR.findOne({ appId: req.params.app_appId });
    if (app) {
        return res.status(400).send('That app already exists!');
    } else {
        // Insert the new app if it does not exist yet
        app = new AppSR({
            icon: req.body.icon,
            url: req.body.url,
            description: req.body.description,
            appId: req.params.app_appId,
            title: req.body.title
        });
        result = await app.save();
        res.send(result);
    }
}

// Display list of reviewed accepted apps.
exports.getReviewAccept = async (req, res) => {
    try{
        var result = await AppRA.find().exec();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_apps_review_accept = async (req, res) => {
    // Check if this app already exisits
    let app = await AppRA.findOne({ appId: req.params.app_appId });
    if (app) {
        return res.status(400).send('That app already exists!');
    } else {
        // Insert the new app if it does not exist yet
        app = new AppRA({
            icon: req.body.icon,
            url: req.body.url,
            description: req.body.description,
            appId: req.params.app_appId,
            title: req.body.title
        });
        result = await app.save();
        res.send(result);
    }
}

exports.delete_review_accept = async(req, res)=>{
    try{
        var result = await AppRA.deleteOne({appId: req.params.app_appId}).exec();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

// Display list of reviewed removed apps.
exports.getReviewRemove = async (req, res) => {
    try{
        var result = await AppRR.find().exec();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_apps_review_remove = async (req, res) => {
    // Check if this app already exisits
    let app = await AppRR.findOne({ appId: req.params.app_appId });
    if (app) {
        return res.status(400).send('That app already exists!');
    } else {
        // Insert the new app if it does not exist yet
        app = new AppRR({
            icon: req.body.icon,
            url: req.body.url,
            description: req.body.description,
            appId: req.params.app_appId,
            title: req.body.title
        });
        result = await app.save();
        res.send(result);
    }
}

exports.delete_review_remove = async(req, res)=>{
    try{
        var result = await AppRR.deleteOne({appId: req.params.app_appId}).exec();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

// Display list of final accepted apps.
exports.getFinalAccept = async (req, res) => {
    try{
        var result = await AppFA.find().exec();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_apps_accepted = async (req, res) => {
    // Check if this app already exisits
    let app = await AppFA.findOne({ appId: req.params.app_appId });
    if (app) {
        return res.status(400).send('That app already exists!');
    } else {
        // Insert the new app if it does not exist yet
        app = new AppFA({
            icon: req.body.icon,
            url: req.body.url,
            description: req.body.description,
            appId: req.params.app_appId,
            title: req.body.title
        });
        result = await app.save();
        res.send(result);
    }
}

exports.delete_final_accept = async(req, res)=>{
    try{
        var result = await AppFA.deleteOne({appId: req.params.app_appId}).exec();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

// Display list of final removed apps.
exports.getFinalRemove = async (req, res) => {
    try{
        var result = await AppFR.find().exec();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};

exports.post_apps_removed = async (req, res) => {
    // Check if this app already exisits
    let app = await AppFR.findOne({ appId: req.params.app_appId });
    if (app) {
        return res.status(400).send('That app already exists!');
    } else {
        // Insert the new app if it does not exist yet
        app = new AppFR({
            icon: req.body.icon,
            url: req.body.url,
            description: req.body.description,
            appId: req.params.app_appId,
            title: req.body.title
        });
        result = await app.save();
        res.send(result);
    }
}

exports.delete_final_remove = async(req, res)=>{
    try{
        var result = await AppFR.deleteOne({appId: req.params.app_appId}).exec();
        res.send(result);
    }catch(error){
        res.status(500).send(error);
    }
};
