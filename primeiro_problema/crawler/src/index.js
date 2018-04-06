var gplay = require('google-play-scraper');
var fs = require("fs");
var sleep = require('sleep');
var idsImportPaid = require("../AppIdsPaid.json");
var idsImportFree = require("../AppIdsFree.json");

var ids = [];
var reviews = [];

function populateIdsVector() {
    Object.keys(gplay.category).forEach(element => {
        const category = gplay.category[element];
        gplay.list({
            category,
            collection: gplay.collection.TOP_FREE, // TOP_PAID ou TOP_FREE
            num: 2
        }).then((apps) => {
            apps.forEach(app => {
                ids.push(app.appId);
                // if (ids.length == 114) {
                saveOnFile(ids)
                // getIdsInfo(ids);
                // }
            })
        });
    });
}

function getIdsInfo(idsArray) {
    console.log("Teste");
    var reviews = [];
    idsArray.forEach(appId => {
        console.log("App id atual = ", appId);
        sleep.msleep(2000);
        gplay.reviews({
            appId: appId,
            page: 0,
            sort: gplay.sort.RATING,
            lang: 'pt-br'
        }).then(result => {
            reviews.push(result);
            saveOnFile(reviews);
        });
    });
}


// function getIdsInfo(idsArray) {
//     console.log("Gets id info");
//     var obj = {
//         appId: element,
//         page: 0,
//         sort: gplay.sort.RATING,
//         lang: 'pt-br'
//     };
//     gplay.reviews(obj).then(console.log, console.log);

// }

function saveOnFile(file) {
    console.log('Saved on File');
    fs.writeFile("./reviews-free.json", JSON.stringify(file, null, 4), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

getIdsInfo(idsImportFree);
// populateIdsVector();