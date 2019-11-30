var overall_average = 15;

var y_scale = d3.scaleLinear().domain([0,20]).range([0,140]);
var x_scale = d3.scaleBand().range([0, 150]).domain(['JC Avg.','Tract #5']);
var x_axis = d3.axisBottom().scale(x_scale);
var y_axis_scale = d3.scaleLinear().range([0, 140]).domain([20,0]);
var y_axis = d3.axisLeft().scale(y_axis_scale );

var overall_chart_generating = function(feature){
    chart_generating('#overall_graph',20);
                                                };
var gi_chart_generating = function(feature){
    chart_generating('#gi_graph',9);
};

var flood_chart_generating = function(feature){
    chart_generating('#flood_graph',17);
};

var impervious_chart_generating = function(feature){
    chart_generating('#impervious_graph',4);
};


var chart_generating = function(chart_name,data){
    d3.select(chart_name)
        .append('svg')
        .attr('width',175)
        .attr('height', 150)
        .style('padding-top','10px')
        .style('padding-left','15px')
        .style('background', 'white')
        .selectAll('rect')
        .data([15,data])
        .enter()
        .append('rect')
        .attr('x', function(d,i){return i*(75)+25})
        .attr('y',function(d){return 140-y_scale(d)})
        .attr('width',45)
        .attr('height',function(d){return y_scale(d)})
        .attr('fill',function(d){
            if (d>15){
                return '#8BC34A'
            }
            else if(d<15){
                return '#B00020'
            }
            else{
                return '#969696'
            }
        });
    axis_generating(d3.select(chart_name+'>svg'));
};

var axis_generating = function(chart){
    chart.append('g').attr("transform", "translate(10,110)")
                     .call(x_axis).attr('class','x_axis').call(g => g.select(".domain").remove());
    chart.append('g').attr('x', 50).attr('class','y_axis').call(y_axis).call(g => g.select(".domain").remove());
};


overall_chart_generating(0);
gi_chart_generating(0);
impervious_chart_generating(0);
flood_chart_generating(0);
d3.selectAll('g.tick>line').attr('stroke','FFFFFF');
d3.selectAll('g.x_axis>.tick>text').attr('y', '15px').style('font-size','12px').style('font-family','Lato');