var Form = require('../models/form');
var async = require('async');
const form1 = require('../models/form');
const form = require('../models/form');

// Display list of forms.
exports.getForms = async (req, res) => {
    console.log("Beggining GET form ...");
    try{
        
        var result = await Form.find().exec();
        res.status(200).send(result);

    }catch(error){
        console.log(error);
        res.status(500).send({message:'An error occurred'});
    }
};


exports.createForm = async (req, res) => {
    console.log("Beggining POST form ...");
    console.log(req.body);
    // Check if this form already exists
    let data = await Form.findOne({ form_date: req.body.form_date, email: req.body.email });
    if (data) {
        return res.status(400).send({messaeg:'Duplicated form'});
    } else {
        // Insert the new form if it does not exist yet
        try{
            form = new Form( req.body );

            await form.save();
            res.status(200).send(form);

        }catch(error){
            console.log(error);
            res.status(500).send({message:'An error occurred'});
        }
        //res.send(result);
    }
    console.log("End POST form successfully sent");
};