// this part is for dropdown menu
var drop_click = 0;
var drop2_click = 0;
var current_id= "#chart";
// This is for tap button
$(".button").click(function(){
   var target_button = '#'+$(this).attr('id');
   $(current_id).css('border-bottom','1px solid #212121');
   $(current_id).css('border-right','0');
   $(current_id).css('border-left','0');
   $(current_id+'>h4').css('font-weight','400');
   $(current_id+'>h4').css('color','#9E9E9E');

   $(target_button).css('border-bottom','1px dashed #9E9E9E');
   $(target_button).css('border-right','1px solid #212121');
   $(target_button).css('border-left','1px solid #212121');
   $(target_button+'>h4').css('font-weight','700');
   $(target_button+'>h4').css('color','#212121');

   if(target_button==='#chart'){
       $('#chart_info').css('display','flex');
       $('#resource_info').css('display','none');
       $('#action_info').css('display','none');
       $('#header').css('display','flex');
   }
   else if(target_button==='#action'){
       $('#chart_info').css('display','none');
       $('#resource_info').css('display','none');
       $('#action_info').css('display','flex');
       $('#header').css('display','flex');
   }
   else{
       $('#chart_info').css('display','none');
       $('#resource_info').css('display','flex');
       $('#action_info').css('display','none');
       $('#header').css('display','none');
   }
   current_id = target_button;
});


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

$("#graph").click(function () {
    console.log('1');
    $("#text_tract_box").css("display", "none");
    drop_click = 0
});


$("#text_tract_box>p").click(function () {
    var tract_clicked = $(this).attr('id');
    $("#text_tract_box").css("display", "none");
    drop_click = 0
    renew_info(tract_clicked);
    if(tract_clicked==="JC"){
        highlight_jc();
    }
    else{
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
    }
    else{
        $("#region").text("Census Tract "+ tract);
    }

    var tract_filter = tract_info[tract];
    chart_clean();
    overall_chart_generating(tract_filter["overall_score"], tract);
    gi_chart_generating(tract_filter["green_score"], tract);
    impervious_chart_generating(tract_filter["imp_score"],tract);
    flood_chart_generating(tract_filter["flood_score"],tract);
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

var renew_info_2 = function(att_clicked) {
    $("#attribute").text(att_clicked);
    change_grid_layer(att_clicked);
};