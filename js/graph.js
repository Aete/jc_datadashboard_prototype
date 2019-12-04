
var y_scale = d3.scaleLinear().domain([0,6]).range([0,120]);
var x_scale = d3.scaleBand().range([0, 150]).domain(['JC Avg.','Tract #5']);

var y_axis_scale = d3.scaleLinear().range([0, 120]).domain([6,0]);
var y_axis = d3.axisLeft().scale(y_axis_scale );

var overall_chart_generating = function(feature, tract){
    chart_generating('#overall_graph',feature, tract);
                                                };
var gi_chart_generating = function(feature, tract){
    chart_generating('#gi_graph',feature, tract);
};

var flood_chart_generating = function(feature, tract){
    chart_generating('#flood_graph',feature, tract);
};

var impervious_chart_generating = function(feature, tract){
    chart_generating('#impervious_graph',feature, tract);
};


var chart_generating = function(chart_name,data,tract){

    var chart = d3.select(chart_name).append('svg');
    var x_scale = d3.scaleBand().range([0, 150]).domain(['JC Avg.','Tract #'+tract]);
    var x_axis = d3.axisBottom().scale(x_scale);
    axis_generating(d3.select(chart_name+'>svg'), x_axis);
    chart.attr('width',175)
         .attr('height', 150)
         .style('background', 'white')
         .selectAll('rect')
         .data([4.5,data])
         .enter()
         .append('rect')
         .attr('x', function(d,i){return i*(75)+35})
         .attr('y',function(d){return 120-y_scale(d)})
         .attr('width',45)
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

var axis_generating = function(chart,x_axis){
    chart.append('g').attr("transform", "translate(20,115)")
                     .call(x_axis).attr('class','x_axis').call(g => g.select(".domain").remove());
    chart.append('g').attr("transform", "translate(25,-15)").attr('class','y_axis').call(y_axis.ticks(5)).call(g => g.select(".domain").remove());
    grid_generating(chart);
    d3.selectAll('g.x_axis>.tick>line').remove();
    d3.selectAll('g.y_axis>.tick>line').remove();
    d3.selectAll('g.y_axis>.tick:first-child>text').attr('fill','#FFFFFF');
    d3.selectAll('g.x_axis>.tick>text').attr('y', '15px').style('font-size','12px').style('font-family','Lato');
    d3.selectAll('g.y_axis>.tick>text').attr('y', '15px').style('font-size','12px').style('font-family','Lato');
};

var grid_generating = function(chart){
    chart.append('line').attr('x1',25).attr('x2',168).attr('y1',120-y_scale(5)).attr('y2',120-y_scale(5)).style('stroke','#BBBBBB').style('stroke-width',0.2).style("stroke-dasharray", ("4,2"));
    chart.append('line').attr('x1',25).attr('x2',168).attr('y1',120-y_scale(4)).attr('y2',120-y_scale(4)).style('stroke','#BBBBBB').style('stroke-width',0.2).style("stroke-dasharray", ("4,2"));
    chart.append('line').attr('x1',25).attr('x2',168).attr('y1',120-y_scale(3)).attr('y2',120-y_scale(3)).style('stroke','#BBBBBB').style('stroke-width',0.2).style("stroke-dasharray", ("4,2"));
    chart.append('line').attr('x1',25).attr('x2',168).attr('y1',120-y_scale(2)).attr('y2',120-y_scale(2)).style('stroke','#BBBBBB').style('stroke-width',0.2).style("stroke-dasharray", ("4,2"));
    chart.append('line').attr('x1',25).attr('x2',168).attr('y1',120-y_scale(1)).attr('y2',120-y_scale(1)).attr('stroke','#BBBBBB').attr('stroke-width',0.2).attr("stroke-dasharray", ("4,2"));
    chart.append('line').attr('x1',25).attr('x2',168).attr('y1',120).attr('y2',121).attr('stroke','#BBBBBB').attr('stroke-witdh', 0.2);
};



