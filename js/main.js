
function OnClick() {
    let svg = document.getElementById('svg-container');
}

function LoadDataset(filename) {

    // Set dimensions and margins for the graph
const margin = {top: 20, right: 30, bottom: 40, left: 40},
width = 500 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

d3.select('#scatterplot').selectAll('*').remove();

// Append SVG to the scatterplot div
const svg = d3.select("#scatterplot")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load CSV data
d3.csv(filename).then(function(data) {

// Convert the x and y fields to numbers
data.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
});

// Create scales for X and Y axis
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)]) // Domain is from 0 to max value in x
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)]) // Domain is from 0 to max value in y
    .range([height, 0]);

// Add X axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// Add Y axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add dots (the scatterplot points)
svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", d => xScale(d.x))   // X position
    .attr("cy", d => yScale(d.y))   // Y position
    .attr("r", 3)                   // Radius of the point*/
    /*.style("fill", "steelblue");    // Color of the point*/

}).catch(function(error) {
console.error('Error loading the CSV data:', error);
});

}

function ToDataMatrixJSon() {

  let data = d3.select('#scatterplot').selectAll('circle').data();
  var samples = new Array(data.length);
  for (let i = 0; i < data.length; i++)
      samples[i] = new Array(data[i].x, data[i].y);

  let json =  JSON.stringify(samples);
  return json;
}



function Clusterize(clusteringType) {

  //DisableButtons(true);
  let clusters = [];
  let k = document.getElementById('k').value;
  let M = document.getElementById('M').value;
  let json = ToDataMatrixJSon();
  let tuningType = document.querySelector('input[name="TuningType"]:checked').value;

  axios.post('https://localhost:7035/KNN', json, {
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    params: { "k": k , "tuningType": tuningType, "distanceType": "EuclideanDistance"}
  })
  .then((response) => { 
    clusters = [...response.data];
    
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

    // Select all the circles and bind the colors array to them
    d3.select('#scatterplot').selectAll("circle")
       .data(clusters) // Bind the colors array to the circles
       .style("fill", function(d) { return colors[d]; }); // Set the fill color based on the bound data


  })
  .catch(error => console.error(error));

  //ColorAccordingToClusters(chart, clusters);
  //DisableButtons(false);
}

function ColorAccordingToClusters(chart, clusters) {

  var colorsCount = chart.colors.length;

  for (var i = 0; i < chart.dataProvider.length; i++) {
      var dp = chart.dataProvider[i];
      var cluster = clusters[i];
      dp.value = cluster;
      if (cluster != 0) {
          dp.color = chart.colors[cluster % colorsCount];
      } else {

          dp.color = "#000000";

      }
  }

  chart.validateData();
}