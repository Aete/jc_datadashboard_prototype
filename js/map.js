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

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    flyTo: {
        zoom: 14,
        speed: 1, // make the flying slow
        curve: 1, // change the speed at which it zooms out
        easing: function (t) { return t; }
    },
});


var geocoder2 = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    flyTo: {
        zoom: 16,
        speed: 3, // make the flying slow
        curve: 1, // change the speed at which it zooms out
        easing: function (t) { return t; }
    },
});

geocoder.on('result', function (e){
    var coord_ = map.project(e.result.geometry.coordinates);
    var tract_searched = map.queryRenderedFeatures(coord_, {
        layers: ["censusTract-fill"]
    })[0].properties.name;
    highlight(tract_searched);
    renew_info(tract_searched);
});

geocoder2.on('result', function (e){
    var coord_ = e.result.geometry.coordinates;
    console.log(coord_);
    var finding_park = find_nearest_park(coord_);
    console.log(finding_park);
    $('#nearest_park').text(finding_park[0]);
    $('#distance').text(finding_park[1].toFixed(2)+' mi');
    var park_coord_ = map.project([finding_park[2],finding_park[3]]);
    var park_searched = map.queryRenderedFeatures(park_coord_, {
        layers: ["park_fill"]
    })[0].properties.park;

    var park_filter = park_features.features.filter(function(i) {
        return i.properties.park === park_searched;
    });

    var geometry = park_filter[0];
    console.log(geometry);
    if (typeof map.getLayer('selected_park') !== "undefined" ){
        map.removeLayer('selected_park');
        map.removeSource('selected_park');
    }

    map.addSource('selected_park',{'type': 'geojson','data': geometry});
    map.addLayer({
        "id": 'selected_park',
        "type": "fill",
        "source": 'selected_park',
        "layout": {
        },
        "paint": {
            "fill-color": "#1B5E20",
            "fill-opacity":0.7
        }
    });
    change_grid_layer('Map');
});



$('#geocoder').append(geocoder.onAdd(map));
$('#geocoder2').append(geocoder2.onAdd(map));
$('#geocoder>.mapboxgl-ctrl-geocoder').css('box-shadow','none');
$('#geocoder>.mapboxgl-ctrl-geocoder>input').attr('placeholder','Search by address');
$('#geocoder2>.mapboxgl-ctrl-geocoder').css('box-shadow','none');
$('#geocoder2>.mapboxgl-ctrl-geocoder').css('width','100%');
$('#geocoder2>.mapboxgl-ctrl-geocoder>input').attr('placeholder','Search the nearest park your area');
$('#geocoder2>.mapboxgl-ctrl-geocoder>input').css('width','100%');

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

var url_neighborhood = 'js/data/neighborhoods.geojson';
var url_park = 'js/data/park.geojson';
var url_census = 'js/data/tracts.geojson';
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
    map.addSource('census', { type: 'geojson', data: url_census, 'generateId': true});
    map.addSource('grid', { type: 'geojson', data: url_grid, 'generateId': true});

    map.addSource('selected_tract',{'type': 'geojson','data': url_jc});


    map.addLayer({
        "id": "park_fill",
        "source": "park",
        "type": "fill",
        "layout": {
        },
        "paint": {
            "fill-color": palette['light']['boarder_color'],
            "fill-opacity":0
        }
    });


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
    console.log(geometry);
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
                    3, '#FFF082',
                    5, '#1B5B20'
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

var park_keys = Object.keys(park_center_points);
var options = { units: 'miles' };
var find_nearest_park = function(coord){
  var x = coord[0];
  var y = coord[1];
  var nearest_park = null;
  var best_key = null;
  var nearest_dist = 100;
  for(key of park_keys){
      var dist_ = turf.distance(coord, [parseFloat(park_center_points[key]['center_lng']),parseFloat(park_center_points[key]['center_lat'])], options);
      console.log(dist_);
      console.log(nearest_dist);
      if(dist_<nearest_dist){
          console.log('!');
          nearest_park = park_center_points[key]['park'];
          nearest_dist = dist_ ;
          best_key = key;
      }

  }
  return [park_center_points[best_key]['park'],nearest_dist, park_center_points[best_key]['center_lng'], park_center_points[best_key]['center_lat']]
};