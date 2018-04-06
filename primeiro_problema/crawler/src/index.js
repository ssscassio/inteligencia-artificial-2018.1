var gplay = require('google-play-scraper');
var fs = require("fs");
var sleep = require('sleep');
var idsFree = require("../results/ids/ids-free.json");
var idsPaid = require("../results/ids/ids-paid.json");

var ids = [];
var reviews = [];

function populateIdsVector(type) {
    const collection = type == 'free' ?
        gplay.collection.TOP_FREE :
        gplay.collection.TOP_PAID;
    Object.keys(gplay.category).forEach(element => {
        const category = gplay.category[element];
        gplay.list({
            category,
            collection,
            num: 2
        }).then((apps) => {
            apps.forEach(app => {
                ids.push(app.appId);
                saveOnFile(ids, "../results/ids/ids-" + type + ".json");
            })
        });
    });
}

function getIdsInfo(type) {
    const idsArray = type == 'free' ?
        idsFree :
        idsPaid;
    var reviews = [];
    idsArray.forEach(appId => {
        gplay.reviews({
            appId: appId,
            page: 0,
            sort: gplay.sort.RATING,
            lang: 'pt-br'
        }).then(result => {
            reviews.push(result);
            saveOnFile(reviews, "../results/reviews/reviews-" + type + ".json");
        });
        sleep.msleep(2000);
    });
}


function saveOnFile(file, fileUrl) {
    fs.writeFile(fileUrl, JSON.stringify(file, null, 4), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

// Usar "free" para carregar do arquivo ids-free.json
// Usar "paid" para carregar do arquivo ids-paid.json
getIdsInfo("free");

// populateIdsVector("free");