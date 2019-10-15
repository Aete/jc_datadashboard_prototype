var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sghan/ck1ljdcmy16fc1cpg0f4qh3wu',
    center: [-74.030000, 40.720935],
    zoom: 12
});
map.addControl(new mapboxgl.NavigationControl(), 'top-left');


var url1 = 'js/data/jerseycity.json';
var url2 = 'js/data/neighborhoods.geojson';
var hoverNeighborhoodId =  null;

map.on('load', function () {
    window.setInterval(function() {
        map.getSource('route').setData(url1);
        map.getSource('neighborhood').setData(url2);
    }, 2000);
    map.addSource('route', { type: 'geojson', data: url1, 'generateId': true});
    map.addSource('neighborhood', { type: 'geojson', data: url2, 'generateId': true});

    map.addLayer({
        "id": "Jersey city",
        "source": "route",
        "type": "line",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "blue",
            "line-width": 1
        }
    });

    map.addLayer({
        "id": "neighborhoods-border",
        "source": "neighborhood",
        "type": "line",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "black",
            "line-width": 1
        }
    });

    map.addLayer({
        "id": "neighborhoods-fill",
        "source": "neighborhood",
        "type": "fill",
        "layout": { },
        "paint": {
            "fill-color": "green",
            "fill-opacity": ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.2,
                0
            ]
        }
    });
    map.on("click", "neighborhoods-fill", function(e) {
        var neighName = e.features[0].properties.NAME;
        console.log(e.features[0]);
        $("#test").text(neighName);
        map.flyTo({
            center: [ -74.030000, 40.720935],
            zoom: 14
        });
    });

    map.on("mousemove", "neighborhoods-fill", function(e) {
        if (e.features.length > 0) {
            if (hoverNeighborhoodId) {
                map.setFeatureState({source: 'neighborhood', id: hoverNeighborhoodId}, { hover: false});
            }
            hoverNeighborhoodId = e.features[0].id;
            map.setFeatureState({source: 'neighborhood', id: 0}, { hover: false});
            map.setFeatureState({source: 'neighborhood', id: hoverNeighborhoodId}, { hover: true});
        }
    });

    map.on("mouseleave", "neighborhoods-fill", function() {
        if (hoverNeighborhoodId){
            map.setFeatureState({source: 'neighborhood', id: hoverNeighborhoodId}, { hover: false});
        }
        map.setFeatureState({source: 'neighborhood', id: 0}, { hover: false});
        hoverNeighborhoodId =  null;
    });
});

