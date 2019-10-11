var requestURL = 'js/hudson_county_geojson.geojson';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function() {
    var jerseycity = request.response.features[0].geometry.coordinates[0][0];
    console.log(jerseycity);
};

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sghan/ck1ljdcmy16fc1cpg0f4qh3wu',
    center: [-74.040000, 40.725935],
    zoom: 12
});

var url = 'js/hudson_county_geojson.geojson';

map.on('load', function () {
    window.setInterval(function() {
        map.getSource('route').setData(url);
    }, 2000);

    map.addSource('route', { type: 'geojson', data: url});
    map.addLayer({
        "id": "route",
        "source": "route",
        "type": "line",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "blue",
            "line-width": 2
        }
    })

});