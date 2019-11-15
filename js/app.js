var dropbox_making = function(dict_) {
    var keys = Object.keys(dict_);
    for (var i = 0; i < keys.length; i++) {
        $("#dropdown-box").append("<p>"+keys[i]+"</p>");
        $("#dropdown-box>p:last-child").attr('id',keys[i]);
        console.log(keys[i]);
    }
};
var drop_click = 0;
dropbox_making(dataset_jc_green);

$("#header").click(function () {
    if (drop_click===0){
        $("#dropdown-box").css("display", "inline");
        drop_click = 1
    }
    else{
        $("#dropdown-box").css("display", "none");
        drop_click = 0
    }
});

$("#dropdown-box>p").click(function () {
    neigh_clicked = $(this).attr('id');
    renew_info(neigh_clicked);
});

var renew_info = function(neighbor) {
    $("#region").text(neighbor);
    $("#rain").text(dataset_jc_green[neighbor]['rain']);
    if(neighbor==='Jersey City'){
        map.flyTo({
            center: [ centerpoints[neighbor]['lng'], centerpoints[neighbor]['lat']],
            zoom: 12})
    }
    else{
        map.flyTo({
            center: [ centerpoints[neighbor]['lng'], centerpoints[neighbor]['lat']],
            zoom: 13})
    }

};

