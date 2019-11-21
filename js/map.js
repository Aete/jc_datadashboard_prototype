var palette = {
               'dark': { 'mapStyle': 'mapbox://styles/sghan/ck1ljdcmy16fc1cpg0f4qh3wu'},
               'light':{'mapStyle':'mapbox://styles/sghan/ck35793ez3b7q1dpmdl5ek4g2',
                         'boarder_color':'#9E9E9E'   }};

var map = new mapboxgl.Map({
    container: 'map',
    style: palette['light']['mapStyle'],
    center: [-74.030000, 40.720935],
    zoom: 12
});
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

var url_neighborhood = 'js/data/neighborhoods.geojson';
var url_park = 'js/data/park.geojson';
var url_tree_2019_fall = 'js/data/fall_2019.geojson';
var url_tree_2019_spring = 'js/data/spring_2019.geojson';
var url_census = 'js/data/censustract.geojson';
var hoverNeighborhoodId =  null;
var clicked_feature = null;
var tract_clicked = '';


map.on('load', function () {
    window.setInterval(function() {
        map.getSource('park').setData(url_park);
        map.getSource('neighborhood').setData(url_neighborhood);
        map.getSource('census').setData(url_census);
    }, 2000);
    map.addSource('park', { type: 'geojson', data: url_park, 'generateId': true});
    map.addSource('neighborhood', { type: 'geojson', data: url_neighborhood, 'generateId': true});
    map.addSource('tree_2019_fall', { type: 'geojson', data: url_tree_2019_fall, 'generateId': true});
    map.addSource('tree_2019_spring', { type: 'geojson', data: url_tree_2019_spring, 'generateId': true});
    map.addSource('census', { type: 'geojson', data: url_census, 'generateId': true});


    map.addLayer({
        "id": "censusTract-border",
        "source": "census",
        "type": "line",
        "layout": {
            "line-join": "round",
            "line-cap": "round"
            },
        "paint": {
            "line-color": palette['light']['boarder_color'],
            "line-width": 0.1
            }
    });

    map.addLayer({
        "id": "censusTract-fill",
        "source": "census",
        "type": "fill",
        "layout": { },
        "paint": {
            "fill-color": "#616161",
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

map.on("click", "censusTract-fill", function(e) {
    clicked_feature = e.features[0].properties.name;
    highlight(clicked_feature);
    renew_info(clicked_feature);
});

map.on("mouseleave", "censusTract-fill", function() {
    if (hoverNeighborhoodId){
        map.setFeatureState({source: 'census', id: hoverNeighborhoodId}, { hover: false});
    }
    hoverNeighborhoodId =  null;
});

map.on("mousemove","censusTract-fill", function(e) {
    if (e.features.length > 0) {
        if (hoverNeighborhoodId) {
            map.setFeatureState({source: 'census', id: hoverNeighborhoodId}, { hover: false});
            map.setFeatureState({source: 'census', id: 0}, { hover: false});
        }
        hoverNeighborhoodId = e.features[0].id;
        map.setFeatureState({source: 'census', id: hoverNeighborhoodId}, { hover: true});
    }
});



var highlight = function(feature){


    var tract_filter = tract_feature.features.filter(function(i) {
        return i.properties.name === feature;
    });

    var geometry = tract_filter[0];
    if (typeof map.getLayer('selected') !== "undefined" ){
        map.removeLayer('selected');
        map.removeSource('selected_tract');
    }
    map.addSource('selected_tract',{'type': 'geojson','data': geometry});
    map.addLayer({
        "id": 'selected',
        "type": "line",
        "source": 'selected_tract',
        "layout": {
        },
        "paint": {
            "line-color": "#212121",
            "line-width": 1.5
        }
    });
    map.flyTo({
        center: [
            censustracts[feature]["center_lng"]+0.008,
            censustracts[feature]["center_lat"]],
        zoom: 14
    });
};