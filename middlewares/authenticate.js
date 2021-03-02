const auth = require('../services/jwt');

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({ message: 'The request does not have the authentication header' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, ''); // regular expression 

    auth.decodeToken(token)
        .then(response => {
            req.user = response; // payload
            next();
        })
        .catch(response => {
            res.status(response.status);
        });
};