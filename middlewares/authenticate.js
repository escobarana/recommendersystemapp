'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'bZlTZWNyZXRAYXNzd29yZG18U2VjamV0UGFzc3dvcmQP';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({ message: 'The request does not have the authentication header' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, ''); // replace ' or " by empty

    try{ // decode the token
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){ // if the token is not expired
            return res.status(401).send({ message: 'The token has expired' });
        }
    }catch(ex){
        return res.status(404).send({
            message: 'Invalid token'
        });
    }

    req.user = payload; // assign the payload's value so I can access the logged user

    next(); // go to the next method of the route after executing all the logic
};