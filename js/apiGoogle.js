const gplay = require('google-play-scraper').memoized({ maxAge: 1000 * 900 }); //cache 15 min

var numApps = 170;

module.exports = {
    getApps: function () {
        return new Promise(function(resolve, reject) {
            //Envia a R la lista de apps de play store
            gplay.list({
                category: gplay.category.HEALTH_AND_FITNESS,
                num: numApps,
                lang: 'en',
                country: 'gb', 
                fullDetail: true,
                throttle: 10
            }).then((values_apps) => {
                var filterValues = values_apps;
                values_apps = filterValues.filter((el) => {
                    return el.free !== false; //quita los que no sean apps gratis
                });
                gplay.list({
                    category: gplay.category.HEALTH_AND_FITNESS,
                    collection: gplay.collection.TOP_FREE,
                    num: numApps,
                    lang: 'en',
                    country: 'gb', 
                    throttle: 10
                }).then((values_top_free) => {
                    var all_values = values_apps;
                    values_top_free.forEach(p => 
                        all_values.push(p) 
                    )
                    all_values = all_values.filter((arr, index, self) => //elimina los duplicados
                        index === self.findIndex((t) => (t.appId === arr.appId)));
                    resolve(all_values);
                })
            }).catch(error => console.log(`Error in executing ${error}`));
        })},
    searchByKeywords: function (keywords) {
        return new Promise(function(resolve, reject) {
            const promises = []
            keywords.forEach(word => 
                promises.push(getFromKeyword(word)) 
            )
            Promise.all(promises)
            .then(response => resolve(response))
            .catch(error => console.log(`Error in executing ${error}`))
        });
    },
    getAppDetail: function (appId) {
        return new Promise(function(resolve, reject) {
            gplay.app({appId: appId, throttle: 10})
            .then((app) => { 
                resolve(app);
            }).catch(error => console.log(`Error in executing ${error}`));
        });
    },
    getDescriptions: function(all_values){
        return new Promise(function(resolve, reject) {
            var witout_desc = []; //para que ninguna app quede con description = undefined
            all_values.forEach((app) => {
                if(app !== undefined){
                    if(app.description === undefined){
                        witout_desc.push(app);
                    }
                }
            })

            Promise.all(witout_desc.map(function(app) {
                return gplay.app({appId: app.appId, throttle: 10}).then(function(appFetched) {
                    return Promise.resolve(appFetched);
                  }, function(error) {
                    return Promise.reject(error);
                  });
            })).then((response) => { 
                response.forEach( resp => {
                    all_values.forEach(v => {
                        if( resp !== undefined &&  v !== undefined){
                            if(resp.appId === v.appId){
                                v.description = resp.description;
                            }
                        }
                    })
                })
                resolve(all_values);
            }).catch(error => console.log(`Error in executing ${error}`));
        });
    },
    getFromKeyword:function (word) {
        return new Promise(function(resolve, reject) {
                gplay.search({
                    term: word,
                    num: numApps,
                    country : 'gb', //great britain
                    price: 'free',
                    throttle: 10
                    }).then((search_values) => {
                        console.log("word google: " + word);
                        const promises = []
                        search_values.forEach(app => 
                            promises.push(getAppDetail(app.appId)) 
                        )
                        Promise.all(promises)
                        .then((response) => { 
                            var apps = [];
                            response.forEach(p => {
                                if(p !== undefined){
                                    if(p.genreId === 'HEALTH_AND_FITNESS'){
                                        apps.push(p);
                                    }
                                }
                            })
                            resolve(apps);
                        })
                        .catch(error => console.log(`Error in executing ${error}`))
                }).catch(error => console.log(`Error in executing ${error}`));
        });
    }
  };

  function getFromKeyword (word) {
    return new Promise(function(resolve, reject) {
            gplay.search({
                term: word,
                num: numApps,
                country : 'gb', //great britain
                price: 'free',
                throttle: 10
                }).then((search_values) => {
                    console.log("word google: " + word);
                    const promises = []
                    search_values.forEach(app => 
                        promises.push(getAppDetail(app.appId)) 
                    )
                    Promise.all(promises)
                    .then((response) => { 
                        var apps = [];
                        response.forEach(p => {
                            if(p !== undefined){
                                if(p.genreId === 'HEALTH_AND_FITNESS'){
                                    apps.push(p);
                                }
                            }
                        })
                        resolve(apps);
                    })
                    .catch(error => console.log(`Error in executing ${error}`))
            }).catch(console.log)
    });
}

function getAppDetail (appId) {
    return new Promise(function(resolve, reject) {
        gplay.app({appId: appId, throttle: 10}).then((app) => { 
            resolve(app);
        }).catch(reject()) 
    }).catch(error => console.log(`Error in executing ${error}`));
}