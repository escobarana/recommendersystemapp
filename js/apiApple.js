var appStore = require('app-store-scraper').memoized({ maxAge: 1000 * 900 }); //cache 15 min

var numApps = 170;

module.exports = {
    getApps: function () {
        return new Promise(function(resolve, reject) { //promise.All, funciones en paralelo
            appStore.list({
                category: appStore.category.HEALTH_AND_FITNESS,
                num: numApps,
                country: 'gb',
                throttle: 10
            }).then((values_apps) => {
                var filterValues = values_apps;
                values_apps = filterValues.filter((element) => {
                    return element.free !== false && element.genre === 'Health & Fitness'; //quita los que no sean apps gratis
                });
                appStore.list({
                    collection: appStore.collection.TOP_FREE_IPAD,
                    category: appStore.category.HEALTH_AND_FITNESS,
                    num: numApps,
                    country: 'gb', 
                    throttle: 10
                }).then((values_free_ipad) => {
                    var filterValues_free_ipad = values_free_ipad;
                    values_free_ipad = filterValues_free_ipad.filter((element) => {
                        return element.free !== false && element.genre === 'Health & Fitness'; //quita los que no sean apps gratis
                    });
                    appStore.list({
                        collection: appStore.collection.NEW_FREE_IOS,
                        category: appStore.category.HEALTH_AND_FITNESS,
                        num: numApps,
                        country: 'gb', 
                        throttle: 10
                    }).then((values_free_ios) => {
                        var filterValues_free_ios = values_free_ios;
                        values_free_ios = filterValues_free_ios.filter((element) => {
                            return element.free !== false && element.genre === 'Health & Fitness'; //quita los que no sean apps gratis
                        });
                        appStore.list({
                            collection: appStore.collection.TOP_FREE_IOS,
                            category: appStore.category.HEALTH_AND_FITNESS,
                            num: numApps,
                            country: 'gb', 
                            throttle: 10
                        }).then((values_free_top_ios) => {
                            var filterValues_top_ios = values_free_top_ios;
                            values_free_top_ios = filterValues_top_ios.filter((element) => {
                                return element.free !== false && element.genre === 'Health & Fitness'; //quita los que no sean apps gratis
                            });
                            var all_values = values_free_ipad;
                            values_free_ios.forEach(p => 
                                all_values.push(p) 
                            )
                            values_free_top_ios.forEach(p => 
                                all_values.push(p) 
                            )
                            values_apps.forEach(p => 
                                all_values.push(p) 
                            )
                            all_values = all_values.filter((arr, index, self) => //elimina los duplicados
                                index === self.findIndex((t) => (t.appId === arr.appId)));
                            resolve(all_values);
                        }).catch(error => console.log(`Error in executing ${error}`));
                    }).catch(error => console.log(`Error in executing ${error}`));
                }).catch(error => console.log(`Error in executing ${error}`));
            }).catch(error => console.log(`Error in executing ${error}`));
        })
    },
    searchByKeywords: function (keywords) {
        return new Promise(function(resolve, reject) {
            var keywords_apps = new Promise((resolve, reject) => {
                const promises = []
                keywords.forEach(word => 
                    promises.push(getFromKeyword(word)) 
                )
                Promise.all(promises)
                .then(response => resolve(response))
                .catch(error => console.log(`Error in executing ${error}`))
           })
           keywords_apps.then((result) => {
                var not_duplicated_apps = []
                not_duplicated_apps = result.filter(function (a) {
                    return !this[a.appId] && (this[a.appId] = true);
                }, Object.create(null));
                var applications = [];
                for(var i=0; i < not_duplicated_apps.length; i++){ 
                    for(var j=0; j < not_duplicated_apps.length; j++){ 
                        applications.push(not_duplicated_apps[i][j]);
                    }
                }
                resolve(applications);
            });
        });
    },
    getAppDetail: function (val) {
        return new Promise(function(resolve, reject) {
            appStore.app({id: val, throttle: 10}).then((app) => {
                if(app.primaryGenre === "Health & Fitness"){
                    console.log("resolved");
                    resolve(app);
                }
                else{
                    console.log("not resolved");
                    resolve();
                }
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
                try{
                    appStore.app({appId: app.appId, throttle: 10}).then(function(appFetched) {
                        return Promise.resolve(appFetched);
                    }, function(error) {
                        return Promise.reject(error);
                    });
                }catch(err){console.log(err);}
                 
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
            })
        });
    },
    getFromKeyword:function (word) {
        return new Promise(function(resolve, reject) {
            appStore.search({
                term: word,
                num: numApps,
                country : 'gb',
                idsOnly: false, 
                throttle: 10
                }).then((search_values) => {
                    console.log("word apple: " + word);
                    search_values = search_values.filter((element) => {
                        return element.free !== false && element.primaryGenre === 'Health & Fitness'; //quita los que no sean apps gratis
                    });
                    resolve(search_values);
                }).catch(error => console.log(`Error in executing ${error}`))
        });
    }
    
  };

function getFromKeyword (word) {
    return new Promise(function(resolve, reject) {
        appStore.search({
            term: word,
            num: numApps,
            country : 'gb',
            idsOnly: false, 
            throttle: 10
            }).then((search_values) => {
                search_values = search_values.filter((element) => {
                    return element.free !== false && element.primaryGenre === 'Health & Fitness'; //quita los que no sean apps gratis
                });
                console.log("word apple: " + word);
                resolve(search_values);
            }).catch(error => console.log(`Error in executing ${error}`))
    });
}

