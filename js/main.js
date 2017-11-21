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

    render(db);
}

function updateHumanDate(element, index, array) {
    return element.humanDate = setHumanDate(element.timestamp);
}

function setHumanDate(timestamp) {
    return new Date(timestamp * 1000).toString();
}

function render() {
    for (var i = 0; i <= db.length; i++) {
        return $('.tr_table').append("<td class='amount_table'> + db[i].status + </td>");
    }
}var db = [];

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

    newRender();
}

function updateHumanDate(element, index, array) {
    return element.humanDate = setHumanDate(element.timestamp);
}

function setHumanDate(timestamp) {
    return new Date(timestamp * 1000).toString();
}


function newRender() {
    for (var i = 0; i <= db.length; i++) {
        $('tbody').append('<tr><td>' + db[i].amount + '</td><td>' + db[i].type + '</td><td>' + db[i].humanDate + '</td></tr>');
    }
    return;
}
