var gplay = require('google-play-scraper');
var fs = require("fs");
var sleep = require('sleep');

var ids = [];
var reviews = [];

function populateIdsVector() {
    Object.keys(gplay.category).forEach(element => {
        const category = gplay.category[element];
        gplay.list({
            category,
            collection: gplay.collection.TOP_PAID, // TOP_PAID ou TOP_FREE
            num: 2
        }).then((apps) => {
            apps.forEach(app => {
                ids.push(app.appId);
                if (ids.lenght == 114) {
                    getIdsInfo(ids);
                }
            })
        });
    });
}

function getIdsInfo(idsArray) {
    idsArray.forEach(appId => {
        sleep.msleep(5000);
        gplay.reviews({
            appId,
            page: 0,
            sort: gplay.sort.RATING,
            lang: 'pt-br'
        }).then((result) => {
            let positive = 0;
            let negative = 0;
            result.every(review => {
                if (review.score >= 4 && positive < 5) {
                    positive += 1;
                    reviews.push({
                        score: review.score,
                        text: review.text
                    });
                    saveOnFile(reviews);
                    return true;
                } else if (review.score <= 3 && negative < 5) {
                    negative += 1;
                    reviews.push({
                        score: review.score,
                        text: review.text
                    });
                    saveOnFile(reviews);
                    return true;
                }
                return false;
            })
        });
    });
}

function saveOnFile(file) {
    console.log('Saved on File');
    fs.writeFile("./reviews-paid.json", JSON.stringify(file, null, 4), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

populateIdsVector();