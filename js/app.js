// this part is for dropdown menu
var drop_click = 0;
var drop2_click = 0;
var jc_counted_tree = 259758;
var jc_water_captured = 197416000;
var ranges = [0,1,2,3,4,5];
var percents = ['100~80', '80~60', '60~40', '40~20', '20~0'];

$('#num_tree').text(jc_counted_tree.toLocaleString());
$("#total_benefit_tree").text((Math.round((Math.round(jc_counted_tree*67.657)/100))*100).toLocaleString());
$('#water_captured_tree').text(jc_water_captured.toLocaleString());
$('#energy_conserved_tree').text((Math.round((Math.round(jc_counted_tree*969.025)/100))*100).toLocaleString());
$('#co2_removed_tree').text((Math.round((Math.round(jc_counted_tree*454.072)/100))*100).toLocaleString());
$('#air_improved_tree').text((Math.round((Math.round(jc_counted_tree*1.811)/100))*100).toLocaleString());




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
        $('#num_tree').text(jc_counted_tree.toLocaleString());
        $("#total_benefit_tree").text((Math.round((Math.round(jc_counted_tree*67.657)/100))*100).toLocaleString());
        $('#water_captured_tree').text((jc_water_captured).toLocaleString());
        $('#energy_conserved_tree').text((Math.round((Math.round(jc_counted_tree*969.025)/100))*100).toLocaleString());
        $('#co2_removed_tree').text((Math.round((Math.round(jc_counted_tree*454.072)/100))*100).toLocaleString());
        $('#air_improved_tree').text((Math.round((Math.round(jc_counted_tree*1.811)/100))*100).toLocaleString());
        $('#Reason').text('Please click your area');
        $('#recommended_GI').text('---');
    }
    else{
        $("#region").text("Census Tract "+ tract);
        $('#jc_graph').css('display','none');
        $('#tract_graph').css('display','flex');
        var tract_filter = tract_info[tract];
        generate_fake(tract);
        chart_clean();
        overall_chart_generating(tract_filter["overall_score"], tract);
        gi_chart_generating(tract_filter["green_score"], tract);
        impervious_chart_generating(tract_filter["imp_percent"],tract);
        flood_chart_generating(tract_filter["flood_score"],tract);

        $('#num_tree').text(tract_filter["treecountestimate"].toLocaleString());
        $("#total_benefit_tree").text((Math.round((Math.round(tract_filter["treecountestimate"]*67.657)/100))*100).toLocaleString());
        $('#water_captured_tree').text(tract_filter["storwater_managed"].toLocaleString());
        $('#energy_conserved_tree').text((Math.round((Math.round(tract_filter["treecountestimate"]*969.025)/100))*100).toLocaleString());
        $('#co2_removed_tree').text((Math.round((Math.round(tract_filter["treecountestimate"]*454.072)/100))*100).toLocaleString());
        $('#air_improved_tree').text((Math.round((Math.round(tract_filter["treecountestimate"]*1.811)/100))*100).toLocaleString());
    }
};

var generate_fake = function(tract){
    if((tract%3)===0){
        $('#Reason').html(recommendations['case1']['reason']);
        $('#recommended_GI').html(recommendations['case1']['recommendation']);
        $('#recommended_GI').css('font-size','28px');
        $('#recommended_GI').css('margin-top','21px');
        $('#recommended_GI').css('margin-bottom','22px');
    }
    else if((tract%3)===1){
        $('#Reason').text(recommendations['case2']['reason']);
        $('#recommended_GI').text(recommendations['case2']['recommendation']);
        $('#recommended_GI').css('font-size','33px');
        $('#recommended_GI').css('margin-top','35px');
        $('#recommended_GI').css('margin-bottom','35px');
    }
    else{
        $('#Reason').text(recommendations['case3']['reason']);
        $('#recommended_GI').text(recommendations['case3']['recommendation']);
        $('#recommended_GI').css('font-size','33px');
        $('#recommended_GI').css('margin-top','35px');
        $('#recommended_GI').css('margin-bottom','35px');
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
    console.log(att_clicked);
    if(att_clicked==='Overall Score'){
        $('.score').css('display','flex');
        $('.percent').css('display','none');
        $('#legend_1c').css('display','flex');
        $('#legend').css('height','190px');
        $('#leg_0').attr('src','images/overall/0.png');
        $('#leg_1').attr('src','images/overall/1.png');
        $('#leg_2').attr('src','images/overall/2.png');
        $('#leg_3').attr('src','images/overall/3.png');
        $('#leg_4').attr('src','images/overall/4.png');
        $('#leg_5').attr('src','images/overall/5.png');
    }
    else if(att_clicked==='Flood Risk'){
        $('.score').css('display','flex');
        $('.percent').css('display','none');
        $('#legend_1c').css('display','flex');
        $('#legend').css('height','190px');
        $('#leg_0').attr('src','images/flood/0.png');
        $('#leg_1').attr('src','images/flood/1.png');
        $('#leg_2').attr('src','images/flood/2.png');
        $('#leg_3').attr('src','images/flood/3.png');
        $('#leg_4').attr('src','images/flood/4.png');
        $('#leg_5').attr('src','images/flood/5.png');
    }
    else if(att_clicked==='Green View Score'){
        $('.score').css('display','flex');
        $('.percent').css('display','none');
        $('#legend_1c').css('display','flex');
        $('#legend').css('height','190px');
        $('#leg_0').attr('src','images/green/0.png');
        $('#leg_1').attr('src','images/green/1.png');
        $('#leg_2').attr('src','images/green/2.png');
        $('#leg_3').attr('src','images/green/3.png');
        $('#leg_4').attr('src','images/green/4.png');
        $('#leg_5').attr('src','images/green/5.png');
    }
    else{
        $('.score').css('display','none');
        $('.percent').css('display','flex');
        $('#legend_1c').css('display','none');
        $('#legend').css('height','160px');
        $('#leg_1').attr('src','images/impervious/0.png');
        $('#leg_2').attr('src','images/impervious/1.png');
        $('#leg_3').attr('src','images/impervious/2.png');
        $('#leg_4').attr('src','images/impervious/3.png');
        $('#leg_5').attr('src','images/impervious/4.png');

    }
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


