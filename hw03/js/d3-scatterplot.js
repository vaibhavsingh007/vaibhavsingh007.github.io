// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 20, bottom: 30, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
// Adds the svg canvas
var svg = d3.select("#d3-data")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


var showPoints = function (data, colors) {

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) { return d.X; }));
    y.domain(d3.extent(data, function (d) { return d.Y; }));

    // Clear SVG
    d3.selectAll("svg > g > *").remove();

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 4)
        .attr("cx", function (d) {
            return x(d.X);
        })
        .attr("cy", function (d) {
            return y(d.Y);
        })
        .attr('fill', function (d, i) {
            var c = colors[i];
            return d3.rgb(200 - c.r, 200 - c.g, 200 - c.b);
        });
};