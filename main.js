// Author: Junchao Zheng, Xing Cui
// Date: 4-17-2016
// Discussed with Lanyu Shang, using prototype: http://bl.ocks.org/weiglemc/6185069

// define margins
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// draw the picture
var draw = function(mpg_min,mpg_max) {

  // get the selected input
  var var_x = document.getElementById("sel-x").value;
  var var_y = document.getElementById("sel-y").value; 

  // setup x 
  var xValue = function(d) { return d[var_x];}, // data -> value
      xScale = d3.scale.linear().range([0, width]),  // value -> display
      xMap = function(d) { return xScale(xValue(d));},  // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d[var_y];}, // data -> value 
      yScale = d3.scale.linear().range([height, 0]),  // value -> display
      yMap = function(d) { return yScale(yValue(d));},  // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  // empty the plots
  var svg = d3.select("svg")  
      .attr("width", 400)
      .attr("height", 300)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // load data
    d3.csv("car.csv", function(error, data) {

      data.forEach(function(d) {
        d.mpg = +d.mpg;
        d.cylinders = +d.cylinders;
        d.displacement = +d.displacement;
        d.horsepower = +d.horsepower;
        d.weight = +d.weight;
        d.acceleration = +d.acceleration;
        d["model.year"] = +d["model.year"];
    });

    // no overlapping axis
    xScale.domain([d3.min(data, xValue)-5, d3.max(data, xValue)+5]);
    yScale.domain([d3.min(data, yValue)-5, d3.max(data, yValue)+5]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(var_x);

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(var_y);

    // draw dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .on("mouseover", function(d) {
           $('#hovered').text(d.name)
        });
  });
};

function refreshButton(){
  $('#update').on('click', function(){
    window.location.reload();
    var mpg_min = +$('#mpg-min').val();
    var mpg_max = +$('#mpg-max').val();
    draw(mpg_min,mpg_max);
  });
};

$(document).ready(function() {
  draw(0,50);
  refreshButton();
});
