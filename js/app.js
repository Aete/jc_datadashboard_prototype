var dropbox_making = function(dict_) {
    var keys = Object.keys(dict_);
    for (var i = 0; i < keys.length; i++) {
        $("#text1_box").append("<p>Census Tract "+keys[i]+" &nbsp</p>");
        $("#text1_box>p:last-child").attr('id',keys[i]);
        console.log(keys[i]);
    }
};
var drop_click = 0;
var drop2_click = 0;
dropbox_making(censustracts);

$("#text1").click(function () {
    if (drop_click===0){
        $("#text1_box").css("display", "inline");
        drop_click = 1
    }
    else{
        $("#text1_box").css("display", "none");
        drop_click = 0
    }
});

$("#text1_box>p").click(function () {
    var tract_clicked = $(this).attr('id');
    renew_info(tract_clicked);
    highlight(tract_clicked);
    $("#text1_box").css("display", "none");
    drop_click = 0
});

var renew_info = function(tract) {
    $("#region").text("Census Tract "+ tract);
};

$("#text2").click(function () {
    if (drop2_click===0){
        $("#text2_box").css("display", "inline");
        drop2_click = 1
    }
    else{
        $("#text2_box").css("display", "none");
        drop2_click = 0
    }
});

$("#text2_box>p").click(function () {
    var attr_clicked = $(this)[0].innerText;
    console.log(attr_clicked);
    renew_info_2(attr_clicked);
    $("#text2_box").css("display", "none");
    drop2_click = 0
});

var renew_info_2 = function(att_clicked) {
    $("#attribute").text(att_clicked);
};