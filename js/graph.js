var overall_average = 15;

var y_scale = d3.scaleLinear().domain([0,20]).range([0,180]);

var overall_chart = d3.select('#overall_graph')
                       .append('svg')
                       .attr('width',200)
                       .attr('height', 150)
                       .style('background', 'white')
                       .selectAll('rect')
                       .data([15,10])
                       .enter()
                       .append('rect')
                       .attr('x', function(d,i){return i*(75)+25})
                       .attr('y',function(d){console.log(y_scale(d)); return 145-y_scale(d)})
                       .attr('width',50)
                       .attr('height',function(d){return y_scale(d)})
                       .style('fill','#636363');

overall_chart();