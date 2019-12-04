var palette = {
               'dark': { 'mapStyle': 'mapbox://styles/sghan/ck1ljdcmy16fc1cpg0f4qh3wu'},
               'light':{'mapStyle':'mapbox://styles/sghan/ck35793ez3b7q1dpmdl5ek4g2',
                         'boarder_color':'#636363'   }};

var map = new mapboxgl.Map({
    container: 'map',
    style: palette['light']['mapStyle'],
    center: [-74.070000, 40.715535],
    zoom: 12
});
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

var url_neighborhood = 'js/data/neighborhoods.geojson';
var url_park = 'js/data/park.geojson';
var url_tree_2019_fall = 'js/data/fall_2019.geojson';
var url_tree_2019_spring = 'js/data/spring_2019.geojson';
var url_census = 'js/data/test2.geojson';
var url_jc = 'js/data/jerseycity.json';
var url_grid = 'js/data/grid_1204.geojson';
var hoverNeighborhoodId =  null;
var clicked_feature = null;

map.on('load', function () {
    window.setInterval(function() {
        map.getSource('park').setData(url_park);
        map.getSource('neighborhood').setData(url_neighborhood);
        map.getSource('census').setData(url_census);
        map.getSource('grid').setData(url_grid);
    }, 2000);

    map.addSource('park', { type: 'geojson', data: url_park, 'generateId': true});
    map.addSource('neighborhood', { type: 'geojson', data: url_neighborhood, 'generateId': true});
    map.addSource('tree_2019_fall', { type: 'geojson', data: url_tree_2019_fall, 'generateId': true});
    map.addSource('tree_2019_spring', { type: 'geojson', data: url_tree_2019_spring, 'generateId': true});
    map.addSource('census', { type: 'geojson', data: url_census, 'generateId': true});
    map.addSource('grid', { type: 'geojson', data: url_grid, 'generateId': true});

    map.addSource('selected_tract',{'type': 'geojson','data': url_jc});





    map.addLayer({
        "id": 'selected',
        "type": "line",
        "source": 'selected_tract',
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#212121",
            "line-width": 0.2
        }
    });


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
        var fs = map.queryRenderedFeatures(e.point, { layers: ['censusTract-fill']});
        hoverNeighborhoodId = fs[0].id;

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
            tract_info[feature]["center_lng"],
            tract_info[feature]["center_lat"]],
        zoom: 14
    });
};

var highlight_jc=function(){
    if (typeof map.getLayer('selected') !== "undefined" ){
        map.removeLayer('selected');
        map.removeSource('selected_tract');
    }
    map.addSource('selected_tract',{'type': 'geojson','data': url_jc});
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
        center: [-74.070000, 40.715535],
        zoom: 12
    });
};


var change_grid_layer=function(attr){
    if (typeof map.getLayer('grid') !== "undefined" ){
        map.removeLayer('grid');
    }

    if(attr==='Map'){
        console.log(attr);
    }
    else if(attr==='Overall Score'){
        map.addLayer({
            "id": "grid",
            "source": "grid",
            "type": "fill",
            "layout": {

            },
            "paint": {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'overall_score'],
                    0, '#F44336',
                    3, '#FFFFF2',
                    5, '#1565c0'
                ],
                "fill-opacity": 0.7
            }
        },'censusTract-border');
    }

    else if(attr === 'Flood Risk'){
        map.addLayer({
            "id": "grid",
            "source": "grid",
            "type": "fill",
            "layout": {

            },
            "paint": {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'flood_score'],
                    0, '#0D47A1',
                    5, '#FFFFFF'
                ],
                "fill-opacity": 0.7
            }
        },'censusTract-border');
    }

    else if(attr === 'Green View Score'){
        map.addLayer({
            "id": "grid",
            "source": "grid",
            "type": "fill",
            "layout": {

            },
            "paint": {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'green_score'],
                    0, '#FFFFF2',
                    5, '#1B5B20'
                ],
                "fill-opacity": 0.7
            }
        },'censusTract-border');
    }
    else{
        map.addLayer({
            "id": "grid",
            "source": "grid",
            "type": "fill",
            "layout": {

            },
            "paint": {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'imp_percent'],
                    0, '#FFFFFE',
                    60, '#FFFFFE',
                    100,'#212121'
                ],
                "fill-opacity": 0.7
            }
        },'censusTract-border');
    }
};


