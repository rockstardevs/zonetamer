(function(document) {
  'use strict';
  var app = document.querySelector('#app');
  app.highlightedIndex = null;
  app.masterclock = moment().startOf('day').freeze();
  app.format = "ha z";
  app.initializePlaces = function() {
    app.places = [];
  }
  //document.querySelector('iron-localStorage').addEventListener("iron-localstorage-load", function() {
    // console.log('loaded from local storage');
  // })
  var ac = null;

  function handleSearch() {
    var place = ac.getPlace(),
        location = place.geometry.location.toUrlValue(),
        country = place.address_components[place.address_components.length - 1].long_name,
        name = place.vicinity + ', ' + country;
    app.$.searchAjax.params = {
      "location": location,
      "timestamp": moment().unix(),
      "api_key": "AIzaSyBLUV07Tw-tWxbRI-3ipjHXF5_dsZKDY14"
    };
    app.$.searchAjax.generateRequest();
  };

  app.resolveTimeZone = function(e) {
    var place = ac.getPlace(),
        country = place.address_components[place.address_components.length - 1].long_name,
        name = place.vicinity;
    var place = {"city": name, "country": country, "tz": e.detail.response.timeZoneId};
    app.push("places", place);
    document.querySelector('#citySearch').value = null;
  };

  app.removePlace = function(e, place) {
    var idx = this.places.indexOf(place.item);
    console.log(idx);
    if (idx != -1) app.splice("places", idx, 1);
  }

  // Bind searchbox with autocomplete.
  document.querySelector("google-maps-api").addEventListener('api-load', function(e) {
    ac = new this.api.places.Autocomplete(
        (document.querySelector('#citySearch')),
        {types: ['(cities)']}
    );
    ac.addListener("place_changed", handleSearch);
  });
})(document);