/**
 * type: ask - продажа, bid - покупка.
 * tprice: цена покупки/продажи.
 * tamount: количество купленного/проданного.
 * ttid: идентификатор сделки.
 * ttimestamp: UNIX time сделки.
 * */

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
    btcs = _.sortBy(btcs, 'tid'); //сортируем полученные данные по tid т.к. он уникальный

    //если db уже заполнен (вторая и последующие загрузки) то фильтруем полученные данные
    if (db.length) {
        //для этого в уже сохраненных данных находим максимальный tid
        var max = _.max(db, function (data) {
            return data.tid;
        });
        //отфельтровываем полученные данные оставляя только те которые больше максимального
        btcs = _.filter(btcs, function (btc) {
            return btc.tid > max.tid;
        });
    }

    btcs.forEach(updateHumanDate); //добавляем человекопонятную дату
    btcs = _.indexBy(btcs, 'tid'); //переделываем объект добавляя уникальный ключ из {name: 'moe', age: 40} в "40": {name: 'moe', age: 40} http://underscorejs.ru/#indexBy
    btcs = _.toArray(btcs); // преврощаем объект в массив


    if (btcs.length) {
        db = db.concat(btcs); //объединяем массивы
    }

    newRender(db);
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
}
