var db = [];

$(document).ready(function ($) {
    getWexTrades();
    $('.js-update').on('click', function (e) {
        getWexTrades();
    })
});

function getWexTrades() {
    $.ajax({
        type: "GET",
        url: "https://wex.nz/api/3/trades/btc_usd",
        dataType: 'jsonp',
        async: false,
        success: updateData
    });
}

function updateData(data) {
    var btcs = data.btc_usd;
    btcs = _.sortBy(btcs, 'tid');

    if (db.length) {
        var max = _.max(db, function (data) {
            return data.tid;
        });
        btcs = _.filter(btcs, function (btc) {
            return btc.tid > max.tid;
        });
    }

    btcs.forEach(updateHumanDate);
    btcs = _.indexBy(btcs, 'tid');
    btcs = _.toArray(btcs);

    if (btcs.length) {
        db = db.concat(btcs);
    }

    console.log(db);
}

function updateHumanDate(element, index, array) {
    return element.humanDate = setHumanDate(element.timestamp);
}

function setHumanDate(timestamp) {
    return new Date(timestamp * 1000).toString();
}
