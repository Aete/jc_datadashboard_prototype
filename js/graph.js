var jc_avg = {'#overall_graph':1.85,
              '#gi_graph':2.83,
              '#flood_graph':1.76,
              '#impervious_graph':83.13,

};


var overall_chart_generating = function(feature, tract){
    chart_generating('#overall_graph',feature, tract,jc_avg['#overall_graph'],6);
                                                };
var gi_chart_generating = function(feature, tract){
    chart_generating('#gi_graph',feature, tract, jc_avg['#gi_graph'],6);
};

var flood_chart_generating = function(feature, tract){
    chart_generating('#flood_graph',feature, tract, jc_avg['#flood_graph'], 6);
};

var impervious_chart_generating = function(feature, tract){
    chart_generating('#impervious_graph',feature, tract, jc_avg['#impervious_graph'],120);
};


var chart_generating = function(chart_name,data,tract,avg, scale){

    var chart = d3.select(chart_name).append('svg');
    var x_scale = d3.scaleBand().range([0, 145]).domain(['JC Avg.','Tract #'+tract]);
    var y_scale = d3.scaleLinear().domain([0,scale]).range([0,120]);
    var y_axis_scale = d3.scaleLinear().range([0, 120]).domain([scale,0]);
    var y_axis = d3.axisLeft().scale(y_axis_scale);
    var x_axis = d3.axisBottom().scale(x_scale);
    axis_generating(d3.select(chart_name+'>svg'), x_axis, y_axis,y_scale,scale);
    chart.attr('width',200)
         .attr('height', 140)
         .style('background', 'white')
         .selectAll('rect')
         .data([avg,data])
         .enter()
         .append('rect')
         .attr('x', function(d,i){return i*(70)+40})
         .attr('y',function(d){return 120-y_scale(d)})
         .attr('width',35)
         .attr('height',function(d){return y_scale(d)})
         .attr('fill',function(d, i){
                if(i===0){
                    return '#969696'
                }
                else{
                    return '#424242'
                }
         })

};

var axis_generating = function(chart,x_axis,y_axis,y_scale,scale){

    chart.append('g').attr("transform", "translate(21,115)")
                     .call(x_axis).attr('class','x_axis').call(g => g.select(".domain").remove());
    chart.append('g').attr("transform", "translate(30,-15)").attr('class','y_axis').call(y_axis.ticks(5)).call(g => g.select(".domain").remove());
    grid_generating(chart,y_scale,scale);
    d3.selectAll('g.x_axis>.tick>line').remove();
    d3.selectAll('g.y_axis>.tick>line').remove();
    d3.selectAll('g.y_axis>.tick:first-child>text').attr('fill','#FFFFFF');
    d3.selectAll('g.x_axis>.tick>text').attr('y', '15px').style('font-size','12px').style('font-family','Lato');
    d3.selectAll('g.y_axis>.tick>text').attr('y', '15px').style('font-size','10px').style('font-family','Lato');
};

var grid_generating = function(chart,y_scale,scale){
    if(scale == 6) {
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(5)).attr('y2', 120 - y_scale(5)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(4)).attr('y2', 120 - y_scale(4)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(3)).attr('y2', 120 - y_scale(3)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(2)).attr('y2', 120 - y_scale(2)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(1)).attr('y2', 120 - y_scale(1)).attr('stroke', '#BBBBBB').attr('stroke-width', 0.2).attr("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120).attr('y2', 121).attr('stroke', '#BBBBBB').attr('stroke-witdh', 0.2);
    }
    else if(scale == 120){
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(100)).attr('y2', 120 - y_scale(100)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(80)).attr('y2', 120 - y_scale(80)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(60)).attr('y2', 120 - y_scale(60)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(40)).attr('y2', 120 - y_scale(40)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(20)).attr('y2', 120 - y_scale(20)).attr('stroke', '#BBBBBB').attr('stroke-width', 0.2).attr("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120).attr('y2', 121).attr('stroke', '#BBBBBB').attr('stroke-witdh', 0.2);
    }
    else{
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(30)).attr('y2', 120 - y_scale(30)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(24)).attr('y2', 120 - y_scale(24)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(18)).attr('y2', 120 - y_scale(18)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(12)).attr('y2', 120 - y_scale(12)).style('stroke', '#BBBBBB').style('stroke-width', 0.2).style("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120 - y_scale(6)).attr('y2', 120 - y_scale(6)).attr('stroke', '#BBBBBB').attr('stroke-width', 0.2).attr("stroke-dasharray", ("4,2"));
        chart.append('line').attr('x1', 25).attr('x2', 168).attr('y1', 120).attr('y2', 121).attr('stroke', '#BBBBBB').attr('stroke-witdh', 0.2);

    }
};



