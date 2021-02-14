'use strict'

const auth = require('../services/jwt');

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({ message: 'The request does not have the authentication header' });
    }

    var token = req.headers.authorization.split(' ')[1];

    auth.decodeToken(token)
        .then(response => {
            req.user = response;
            next();
        })
        .catch(response => {
            res.status(response.status);
        });
};