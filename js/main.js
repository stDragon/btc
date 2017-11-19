var App = {}; 

$(document).ready(function ($) { 
    App.data = getWexTrades();
    $('.js-update').on('click', function(e){
        getWexTrades();
    })
});

function getWexTrades() {
    $.ajax({ 
        type: "GET", 
        url: "https://wex.nz/api/3/trades/btc_usd", 
        dataType: 'jsonp',
        async:false,
        success: function (data){ 
            var btc = data.btc_usd; 
            btc.forEach(updateDate);
            App.data = btc;
            console.log(App.data);
        } 
    });
}

function updateDate(element, index, array) { 
    return element.humanDate = setHumanDate(element.timestamp); 
} 

function setHumanDate(timestamp) { 
    return new Date(timestamp * 1000).toString(); 
}
