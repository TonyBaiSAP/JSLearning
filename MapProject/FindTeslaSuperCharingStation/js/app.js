// Initial array of locations
var locations = [
    {
        name: "特斯拉超级充电站(上海金桥店)",
        lat: 31.246675684346116,
        lng: 121.58711653108848,
        id: "4bd55750637ba5930241f670"
    },
    {
        name: "博雅酒店-停车场",
        lat: 31.1983952687,
        lng: 121.5849793932,
        id: "5369eb86498e3dcee2506177"
    },
    {
        name: "特斯拉超级充电站(盛大天地站)",
        lat: 31.176962,
        lng: 121.612778,
        id: "4bbff1e4920eb7137559182c"
    },
    {
        name: "上海绿地缤纷广场(周浦店)",
        lat: 31.118407,
        lng: 121.600865,
        id: "587f401c2896a2782c7500c2"
    },
    {
        name: "绿地张江缤纷广场",
        lat: 31.18437,
        lng: 121.609567,
        id: "59c635da32b61d76e8ba8c51"
    },
    {
        name: "特斯拉超级充电站(蓝天大厦站)",
        lat: 31.303347,
        lng: 121.522817,
        id: "4ca5610b931bb60c85c389e2"
    }
];

// Initialize the map
var map;
function initMap() {
    "use strict";
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 31.231777, lng: 121.559778},
        zoom: 11,
        disableDefaultUI: true
    });
    // Start the ViewModel here so it doesn't initialize before Google Maps loads
    ko.applyBindings(new ViewModel());
}

// Alert the user if google maps isn't working
function googleError() {
    "use strict";
    document.getElementById('error').innerHTML = "<h2>Google Maps is not loading. Please try refreshing the page later.</h2>";
}

// Place constructor
// Credit https://discussions.udacity.com/t/having-trouble-accessing-data-outside-an-ajax-request/39072/10
var Place = function (data) {
    "use strict";
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.id = ko.observable(data.id);
    this.marker = ko.observable();
    this.phone = ko.observable('');
    this.description = ko.observable('');
    this.address = ko.observable('');
    this.rating = ko.observable('');
    this.url = ko.observable('');
    this.canonicalUrl = ko.observable('');
    this.photoPrefix = ko.observable('');
    this.photoSuffix = ko.observable('');
    this.contentString = ko.observable('');
};

// ViewModel
var ViewModel = function () {
    "use strict";
    // Make this accessible
    var self = this;

    // Create an array of all places
    this.placeList = ko.observableArray([]);

    // Call the Place constructor
    // Create Place objects for each item in locations & store them in the above array
    locations.forEach(function (placeItem) {
        self.placeList.push(new Place(placeItem));
    });

    // Initialize the infowindow
    var infowindow = new google.maps.InfoWindow({
        maxWidth: 200,
    });

    // Initialize marker
    var marker;

    // For each place, set markers, request Foursquare data, and set event listeners for the infowindow
    self.placeList().forEach(function (placeItem) {

        // Define markers for each place
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(placeItem.lat(), placeItem.lng()),
            map: map,
            animation: google.maps.Animation.DROP
        });
        placeItem.marker = marker;

        // Make AJAX request to Foursquare
        $.ajax({
            url: 'https://api.foursquare.com/v2/venues/search?ll=' + placeItem.lat().toString() + ',' + placeItem.lng().toString() +
            '&oauth_token=ATM5JX02TN0EFMJUVAT4GSTZOVR1YOL04D5ZY30QEZOTEZRB&v=20180507',
            dataType: "json",
            success: function (data) {
                // Make results easier to handle
                var result = data.response.venues;

                // The following lines handle inconsistent results from Foursquare
                // Check each result for properties, if the property exists,
                // add it to the Place constructor
                var contact = result.hasOwnProperty('contact') ? result.contact : '';
                if (contact.hasOwnProperty('formattedPhone')) {
                    placeItem.phone(contact.formattedPhone || '');
                }

                var location = result.hasOwnProperty('location') ? result.location : '';
                if (location.hasOwnProperty('address')) {
                    placeItem.address(location.address || '');
                }

                var bestPhoto = result.hasOwnProperty('bestPhoto') ? result.bestPhoto : '';
                if (bestPhoto.hasOwnProperty('prefix')) {
                    placeItem.photoPrefix(bestPhoto.prefix || '');
                } else {
                    placeItem.photoPrefix('./image/tesla');
                }

                if (bestPhoto.hasOwnProperty('suffix')) {
                    placeItem.photoSuffix(bestPhoto.suffix || '');
                } else {
                    placeItem.photoSuffix('.png');
                }

                var description = result.hasOwnProperty('description') ? result.description : '';
                placeItem.description(description || '');

                var rating = result.hasOwnProperty('rating') ? result.rating : '';
                placeItem.rating(rating || 'none');

                var url = result.hasOwnProperty('url') ? result.url : '';
                placeItem.url(url || '');

                placeItem.canonicalUrl(result.canonicalUrl);

                // Infowindow code is in the success function so that the error message
                // displayed in infowindow works properly, instead of a mangled infowindow

                // Content of the infowindow
                var contentString = '<div id="iWindow"><h4>' + placeItem.name() + '</h4><div id="pic"><img src="' +
                        placeItem.photoPrefix() + '110x110' + placeItem.photoSuffix() +
                        '" alt="Image Location"></div><p>Information from Foursquare:</p><p>' +
                        placeItem.phone() + '</p><p>' + placeItem.address() + '</p><p>' +
                        placeItem.description() + '</p><p>Rating: ' + placeItem.rating() +
                        '</p><p><a href=' + placeItem.url() + '>' + placeItem.url() +
                        '</a></p><p><a target="_blank" href=' + placeItem.canonicalUrl() +
                        '>Foursquare Page</a></p><p><a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' +
                        placeItem.lat() + ',' + placeItem.lng() + '>Directions</a></p></div>';

                google.maps.event.addListener(placeItem.marker, 'click', function () {
                    infowindow.open(map, this);
                    placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        placeItem.marker.setAnimation(null);
                    }, 500);
                    infowindow.setContent(contentString);
                    map.setCenter(placeItem.marker.getPosition());
                });
            },
            // Alert the user on error. Set messages in the DOM and infowindow
            error: function (e) {
                infowindow.setContent('<h5 style=" color: red; ">Foursquare data is unavailable. Please try refreshing later.</h5>');
                document.getElementById("error").innerHTML = '<h4 style=" color: red; ">Foursquare data is unavailable. Please try refreshing later.</h4>';
            }
        });

        // This event listener makes the error message on AJAX error display in the infowindow
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, this);
            placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                placeItem.marker.setAnimation(null);
            }, 500);
        });
    });

    // Activate the appropriate marker when the user clicks a list item
    self.showInfo = function (placeItem) {
        google.maps.event.trigger(placeItem.marker, 'click');
        self.hideElements();
    };

    // Toggle the nav class based style
    self.toggleNav = ko.observable(false);
    this.navStatus = ko.pureComputed (function () {
        return self.toggleNav() === false ? 'nav' : 'navClosed';
        }, this);

    self.hideElements = function (toggleNav) {
        self.toggleNav(true);
        // Allow default action
        return true;
    };

    self.showElements = function (toggleNav) {
        self.toggleNav(false);
        return true;
    };

    // Filter markers per user input

    // Array containing only the markers based on search
    self.visible = ko.observableArray();

    // All markers are visible by default before any user input
    self.placeList().forEach(function (place) {
        self.visible.push(place);
    });

    // Track user input
    self.userInput = ko.observable('');

    // If user input is included in the place name, make it and its marker visible
    // Otherwise, remove the place & marker
    self.filterMarkers = function () {
        // Set all markers and places to not visible.
        var searchInput = self.userInput().toLowerCase();
        self.visible.removeAll();
        self.placeList().forEach(function (place) {
            place.marker.setVisible(false);
            // Compare the name of each place to user input
            // If user input is included in the name, set the place and marker as visible
            if (place.name().toLowerCase().indexOf(searchInput) !== -1) {
                self.visible.push(place);
            }
        });
        self.visible().forEach(function (place) {
            place.marker.setVisible(true);
        });
    };

};