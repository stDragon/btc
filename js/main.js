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
        //если кнопка была нажата но данные еще не обновиились запрещаем повторное нажатие
        if (!$('.js-update').prop('disabled')) {
            $('.js-update').prop('disabled', true);
            getWexTrades().done(function () {
                $('.js-update').prop('disabled', false);
            });
        }
    })
});

function getWexTrades() {
    return $.ajax({
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
    return moment(timestamp * 1000).format('MM/DD/YYYY, HH:mm:ss');
}


function newRender() {
    var tbody = '';
    for (var i = 0; i < db.length; i++) {
        tbody += renderRow(db[i]);
    }
    $('tbody').append(tbody);
}

function renderRow(item) {
    return '<tr><td>' + item.amount + '</td><td>' + item.type + '</td><td>' + item.humanDate + '</td></tr>'
}
