function loadData() {
    const defaultStreet = "Gloden state brige";
    const defaultCity = "San Francisco";
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var oStreet = $("#street");
    var oCity = $("#city");

    var streetStr = oStreet.val();
    var cityStr = oCity.val();
    if(streetStr === "" && cityStr === "") {
        streetStr = defaultStreet;
        cityStr = defaultCity;
        oStreet.val(defaultStreet);
        oCity.val(defaultCity);
    }
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');




    // load nytimes
    // obviously, replace all the "X"s with your own API key
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=09f6a849e49f4f289f7e4b7e89e6b0c4';
    $.getJSON(nytimesUrl, function(data) {

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' +
                '</li>');
        };

    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });



    // load wikipedia data
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            jsonp: "callback"
        })
        .done(function(response) {
            var articleList = response[1];

                for (var i = 0; i < articleList.length; i++) {
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
                };

                clearTimeout(wikiRequestTimeout);
        });

    return false;
};


$('#form-container').submit(loadData);