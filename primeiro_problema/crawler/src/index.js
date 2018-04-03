var gplay = require('google-play-scraper');
var fs = require("fs");

var ids = [];
var reviews = [];

function populateIdsVector() {
    Object.keys(gplay.category).forEach(element => {
        const category = gplay.category[element];
        delay(2000);
        gplay.list({
            category,
            collection: gplay.collection.TOP_PAID, // TOP_PAID ou TOP_FREE
            num: 2
        }).then((apps) => {
            apps.forEach(app => {
                ids.push(app.appId);
                if (ids.lenght == 116) {
                    getIdsInfo();
                }
            })
        });
    });
}

function getIdsInfo() {
    ids.forEach(element => {
        delay(5000);
        gplay.reviews({
            appId: element,
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
                    saveOnFile();
                    return true;
                } else if (review.score <= 3 && negative < 5) {
                    negative += 1;
                    reviews.push({
                        score: review.score,
                        text: review.text
                    });
                    saveOnFile();
                    return true;
                }
                return false;
            })
        });
    });
}

function saveOnFile() {
    fs.writeFile("./output/reviews-paid.json", JSON.stringify(reviews, null, 4));
}