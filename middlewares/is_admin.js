'use strict'

exports.isAdmin = function(req, res, next) {
    if(!req.user.isAdmin){ // not an admin
        return res.status(200).send({message: 'Access denied'});
    }

    next(); // next methods
}