const fetch = require('node-fetch');

module.exports = {
    getAppsFromR: function (url) {
        return new Promise(function(resolve, reject) {
            fetch(url).then(res => res.json()).then((json) =>{ 
                resolve(json);
            }, function(err) {
                console.log(err);
            });
        });
    }
}