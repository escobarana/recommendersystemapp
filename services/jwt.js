var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'bZlTZWNyZXRAYXNzd29yZG18U2VjamV0UGFzc3dvcmQP';

exports.createToken = function(user){
    var payload = {
        sub: user._id, // identifies the user in jwt (id)
        email: user.email,
        name: user.name,
        admin: user.admin,
        list_assign: user.list_assign,
        list_recommend: user.list_recommend,
        list_remove: user.list_remove,
        iat: moment().unix(), // current timestamp
        exp: moment().add(30, 'days').unix() // the token expires in 30 days
    };

    return jwt.encode(payload, secret);
};

exports.decodeToken = function(token){
    const decoded = new Promise((resolve, reject)=>{
        try{
            const payload = jwt.decode(token, secret);

            if(payload.exp <= moment().unix()){ // if the token is expired
                reject({
                    status: 401,
                    message: 'The token has expired'
                });
            }

            resolve(payload.sub);
        }catch(err){
            reject({
                status: 500,
                message: 'Invalid token'
            })
        }
    });

    return decoded;
};