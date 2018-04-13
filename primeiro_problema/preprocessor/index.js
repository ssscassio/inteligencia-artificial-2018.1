var free = require('../crawler/results/reviews/reviews-free.json');
var paid = require('../crawler/results/reviews/reviews-paid.json');
var fs = require("fs");

var filteredPositive = [];
var filteredNegative = [];

var baseSample = [];
var subSample = [];
var superSample = [];

function getScoreQualification(reviewRaw) {
    const { text, score } = reviewRaw;
    let review = { text };
    if (score >= 4) {
        review.qualification = 1;
    } else {
        review.qualification = 0;
    }
    return review;
}

function filter() {
    free.forEach(appReviews => {
        appReviews.forEach(review => {
            if (review.text != "") {
                let reviewQualified = getScoreQualification(review);
                if (reviewQualified.qualification) {
                    filteredPositive.push(reviewQualified);
                } else {
                    filteredNegative.push(reviewQualified);
                }
            }
        })
    })

    paid.forEach(appReviews => {
        appReviews.forEach(review => {
            if (review.text != "") {
                let reviewQualified = getScoreQualification(review);
                if (reviewQualified.qualification) {
                    filteredPositive.push(reviewQualified);
                } else {
                    filteredNegative.push(reviewQualified);
                }
            }
        })
    })
}

function shuffle(arr) {
    return arr.sort(() => {
        return 0.5 - Math.random();
    })
}

function generateSuper(positives, negatives) {
    var ratio = 0;
    var bigger = [];
    var smaller = [];
    if (positives.length > negatives.length) {
        ratio = parseInt(positives.length / negatives.length);
        bigger = positives;
        smaller = negatives;
    } else {
        ratio = parseInt(negatives.length / positives.length);
        bigger = negatives;
        smaller = positives;
    }
    for (var i = 0; i < ratio; i++) {
        bigger = bigger.concat(smaller);
    }
    return bigger;
}

function generateSub(positives, negatives) {
    var bigger = [];
    var smaller = [];
    if (positives.length > negatives.length) {
        bigger = positives;
        smaller = negatives;
    } else {
        bigger = negatives;
        smaller = positives;
    }
    var smallerLenght = smaller.length;
    for (var i = 0; i < smallerLenght; i++) {
        var index = Math.floor(Math.random() * bigger.length);
        smaller.push(bigger[index]);
        bigger.splice(index, 1);
    }
    return smaller;
}

function saveOnFile(file, fileUrl) {
    fs.writeFile(fileUrl, JSON.stringify(file, null, 4), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

filter();
console.log("############################");
console.log("END OF PREPROCESSOR");
console.log("STATS:");
console.log("Base positive: ", filteredPositive.length);
console.log("Base negative: ", filteredNegative.length);
baseSample = filteredPositive.concat(filteredNegative);
baseSample = shuffle(baseSample);
console.log("Base length: ", baseSample.length);
saveOnFile(baseSample, "results/base-sample.json");
superSample = generateSuper(filteredPositive, filteredNegative);
console.log("Super length: ", superSample.length);
saveOnFile(superSample, "results/super-sample.json");
subSample = generateSub(filteredPositive, filteredNegative);
saveOnFile(subSample, "results/sub-sample.json");
console.log("Sub length: ", subSample.length);
console.log("############################");