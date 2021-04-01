var Form = require('../models/form');
var async = require('async');

// Display list of forms.
exports.getForms = async (req, res) => {
    console.log("Starting GET form ...");
    try{
        var result = await Form.find().exec();
        res.status(200).send(result);

    }catch(error){
        res.status(500).send({message:'An error occurred: ', error});
    }
};


exports.createForm = async (req, res) => {
    console.log("Starting POST form ...");
    // Check if this form already exists
    let data = await Form.findOne({ form_date: req.body.form_date, email: req.body.email });
    if (data !== null) {
        return res.status(400).send({messaeg:'Duplicated form'});
    } else {
        // Insert the new form if it does not exist yet
        try{
            let form = new Form( {form_date: req.body.date,
                                  email: req.body.email,
                                  age: req.body.age,
                                  gender: req.body.gender,
                                  os: req.body.os,
                                  answers: req.body.answers
                                } );

            await form.save();
            res.status(200).send(form);
        }catch(error){
            res.status(500).send({message:'An error occurred: ', error});
        }
        //res.send(result);
    }
};