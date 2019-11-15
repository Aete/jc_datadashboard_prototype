var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sghan/ck1ljdcmy16fc1cpg0f4qh3wu',
    center: [-74.030000, 40.720935],
    zoom: 12
});
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

var url_neighborhood = 'js/data/neighborhoods.geojson';
var url_park = 'js/data/park.geojson';
var url_tree_2019_fall = 'js/data/fall_2019.geojson';
var url_tree_2019_spring = 'js/data/spring_2019.geojson';
var hoverNeighborhoodId =  null;
var clicked_feature = null;
var neigh_clicked = '';
var neigh_hovered = '';
var centerpoints = {
    'Downtown':{'lng':-74.040664,'lat':40.723850},
    'McGinley Square': {"lng":-74.06397302244267,"lat":40.72199859608176},
    'Journal Square': {"lng":-74.06052908133006,"lat":40.73439997867336},
    'The Heights': {"lng":-74.04084950732488,"lat":40.746501999169425},
    'The Waterfront': {"lng":-74.026000,"lat":40.723850},
    'West Side': {"lng":-74.0750483934907,"lat":40.71983169791139},
    'Hackensack Riverfront': {"lng":-74.07715286495596,"lat":40.7249412311738},
    'Liberty Park': {"lng":-74.04780803472653,"lat":40.69923748533216},
    'Greenville': {"lng":-74.0800702031342,"lat":40.7009381205886},
    'Bergen-Lafayette':{"lng":-74.05639110356594,"lat":40.71241324924449},
    'Lincoln Park': {"lng":-74.0789477476726,"lat":40.728145292890616},
    'Jersey City':{"lng":-74.030000,"lat":40.720935}
};

map.on('load', function () {
    window.setInterval(function() {
        map.getSource('park').setData(url_park);
        map.getSource('neighborhood').setData(url_neighborhood);
    }, 2000);
    map.addSource('park', { type: 'geojson', data: url_park, 'generateId': true});
    map.addSource('neighborhood', { type: 'geojson', data: url_neighborhood, 'generateId': true});
    map.addSource('tree_2019_fall', { type: 'geojson', data: url_tree_2019_fall, 'generateId': true});
    map.addSource('tree_2019_spring', { type: 'geojson', data: url_tree_2019_spring, 'generateId': true});
    map.addLayer({
        "id": "neighborhoods-border",
        "source": "neighborhood",
        "type": "line",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": 'white',
            "line-width": 0.1
        }
    });

    map.addLayer({
        "id": "neighborhoods-fill",
        "source": "neighborhood",
        "type": "fill",
        "layout": { },
        "paint": {
            "fill-color": "#80DEEA",
            "fill-opacity": ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.2,
                0
            ]
        }
    });

    map.addLayer({
        "id": "tree_2019_fall",
        "source": 'tree_2019_fall',
        "type": "circle",
        "layout": {
        },
        "paint": {
            'circle-color': '#00E676',
            'circle-radius': 3
        }
    });

    map.addLayer({
        "id": "tree_2019_spring",
        "source": 'tree_2019_spring',
        "type": "circle",
        "layout": {
        },
        "paint": {
            'circle-color': '#00E676',
            'circle-radius': 3
        }
    });
});


map.on("click", "neighborhoods-fill", function(e) {
    clicked_feature = e.features[0];
    console.log(clicked_feature);
    neigh_clicked = clicked_feature.properties.NAME;
    renew_info(neigh_clicked );
    highlight(clicked_feature);
});

map.on("mouseleave", "neighborhoods-fill", function() {
    if (hoverNeighborhoodId){
        map.setFeatureState({source: 'neighborhood', id: hoverNeighborhoodId}, { hover: false});
    }
    map.setFeatureState({source: 'neighborhood', id: 0}, { hover: false});
    hoverNeighborhoodId =  null;
});

map.on("mousemove", "neighborhoods-fill", function(e) {
    if (e.features.length > 0) {
        if (hoverNeighborhoodId) {
            map.setFeatureState({source: 'neighborhood', id: hoverNeighborhoodId}, { hover: false});
        }
        neigh_hovered = e.features[0].properties.NAME;
        hoverNeighborhoodId = e.features[0].id;
        map.setFeatureState({source: 'neighborhood', id: 0}, { hover: false});
        if(neigh_clicked ===neigh_hovered){
            map.setFeatureState({source: 'neighborhood', id: 0}, { hover: false});
        }
        else{
            map.setFeatureState({source: 'neighborhood', id: hoverNeighborhoodId}, { hover: true});
        }
    }
});

var highlight = function(feature){
    if (typeof map.getLayer('selected') !== "undefined" ){
        map.removeLayer('selected');
        map.removeSource('selectedNeighborhood');
    }
    map.addSource('selectedNeighborhood', {
        "type":"geojson",
        "data": feature
    });
    map.addLayer({
        "id": 'selected',
        "type": "line",
        "source": 'selectedNeighborhood',
        "layout": {
        },
        "paint": {
            "line-color": "#80DEEA",
            "line-width": 1
        }
    });
};