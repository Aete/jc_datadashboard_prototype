// this part is for dropdown menu
var drop_click = 0;
var drop2_click = 0;

// This is about dropbox menus
var dropbox_making = function(dict_) {
    var keys = Object.keys(dict_);
    for (var i = 0; i < keys.length; i++) {
        $("#text_tract_box").append("<p>Census Tract "+keys[i]+" &nbsp</p>");
        $("#text_tract_box>p:last-child").attr('id',keys[i]);
    }
};

dropbox_making(tract_info);

$("#text_tract").click(function () {
    if (drop_click===0){
        $("#text_tract_box").css("display", "inline");
        drop_click = 1
    }
    else{
        $("#text_tract_box").css("display", "none");
        drop_click = 0
    }
});

$("#tract_graph").click(function () {
    console.log('1');
    $("#text_tract_box").css("display", "none");
    drop_click = 0
});


$("#text_tract_box>p").click(function () {
    var tract_clicked = $(this).attr('id');
    $("#text_tract_box").css("display", "none");
    drop_click = 0;
    renew_info(tract_clicked);
    if(tract_clicked==="JC"){
        $('#tract_graph').css('display','none');
        $('#jc_graph').css('display','flex');
        highlight_jc();
    }
    else{
        $('#jc_graph').css('display','none');
        $('#tract_graph').css('display','flex');
        highlight(tract_clicked);

    }
});

var chart_clean = function(){
    $('.barchart').html('');
};

var renew_info = function(tract) {
    console.log(tract);
    if(tract === "JC"){
        $("#region").text("Jersey City");
        $('#tract_graph').css('display','none');
        $('#jc_graph').css('display','flex');
    }
    else{
        $("#region").text("Census Tract "+ tract);
        $('#jc_graph').css('display','none');
        $('#tract_graph').css('display','flex');
        var tract_filter = tract_info[tract];
        chart_clean();
        overall_chart_generating(tract_filter["overall_score"], tract);
        gi_chart_generating(tract_filter["green_score"], tract);
        impervious_chart_generating(tract_filter["imp_percent"],tract);
        flood_chart_generating(tract_filter["flood_score"],tract);

        $('#num_tree').text(tract_filter["treecountestimate"]);
        $("#total_benefit_tree").text((Math.round((Math.round(tract_filter["treecountestimate"]*67.657)/100))*100).toLocaleString());
        $('#water_captured_tree').text(tract_filter["storwater_managed"].toLocaleString());
        $('#energy_conserved_tree').text((Math.round((Math.round(tract_filter["treecountestimate"]*969.025)/100))*100).toLocaleString());
        $('#co2_removed_tree').text((Math.round((Math.round(tract_filter["treecountestimate"]*454.072)/100))*100).toLocaleString());
        $('#air_improved_tree').text((Math.round((Math.round(tract_filter["treecountestimate"]*1.811)/100))*100).toLocaleString());
    }


};

$("#text_att").click(function () {
    if (drop2_click===0){
        $("#text_att_box").css("display", "inline");
        drop2_click = 1
    }
    else{
        $("#text_att_box").css("display", "none");
        drop2_click = 0
    }
});

$("#text_att_box>p").click(function () {
    var attr_clicked = $(this)[0].innerText;
    console.log(attr_clicked);
    renew_info_2(attr_clicked);
    $("#text_att_box").css("display", "none");
    drop2_click = 0
});

var value_range = {

};

var renew_info_2 = function(att_clicked) {
    $("#attribute").text(att_clicked);
    change_grid_layer(att_clicked);
};

// this part is for take action animation

var take_action = 0;

$("#action").click(function(){
    if(take_action===0){
        $("#graphs").css("animation","move 0.7s");
        $("#graphs").css("top","calc(-100% + 40px)");
        $("#scroll_button").html('<span style="font-family: fontello" id="scroll_button"></span>');
        take_action = 1;
        console.log(take_action);
    }
    else{
        $("#graphs").css("animation","moveback 0.7s");
        $("#graphs").css("top","0");
        $("#scroll_button").html('TAKE ACTION &nbsp&nbsp&nbsp<span style="font-family: fontello" id="scroll_button"></span>');
        take_action = 0;
        console.log(take_action);
    }
});


