let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 100
};

let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;

let $svg = d3.select('#plot')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

let $chartGroup = $svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Various accessors that specify the four dimensions of data to visualize.
function x(d) { return d.totalprod; }
function y(d) { return d.priceperlb; }
function radius(d) { return d.numcol; }
function color(d) { return d.state; }
function key(d) { return d.state; }

let url = '/bubble-data';

d3.json(url, (error, honeyData) => {
    if (error) throw error;

    console.log(honeyData);

    let xTestExtent = d3.extent(honeyData, data => data.totalprod[1]),
        xMax = xTestExtent[0][1],
        xMin = xTestExtent[1][1];

    let yTestExtent = d3.extent(honeyData, data => data.priceperlb[1]),
        yMax = yTestExtent[1][1],
        yMin = yTestExtent[0][1];

    let rExtent = d3.extent(honeyData, data => data.numcol[1]),
        rMax = rExtent[0][1],
        rMin = rExtent[1][1];

    console.log(rExtent);

    // Create scale functions
    let xLinearScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, chartWidth]);

    let yLinearScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([chartHeight, 0]);

    let radiusScale = d3.scaleSqrt().domain([rMin, rMax]).range([0, 40]),
        colorScale = d3.scaleQuantize()
            .domain([0, 44])
            .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
                "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

    // Create axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Generate axes groups
    $chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .attr('id', 'x-axis')
        .call(bottomAxis);

    $chartGroup.append('g')
        .attr('id', 'y-axis')
        .call(leftAxis);

    // Break here for testing

    // A bisector since many nation's data is sparsely-defined.
    let bisect = d3.bisector(data => data[0]);

    // Add a dot per nation. Initialize the data at 1998, and set the colors.
    // Create a group for the circles
    let $circleGroup = $chartGroup.append('g');

    $circleGroup.selectAll('circle')
        .data(insertData(1998))
        .enter()
        .append('circle')
        .classed('state-circle', true)
        .style('fill', 'blue')
        // .style('fill', data => colorScale(color(data)))
        .call(position);
    // .sort(order);

    // Interpolates the dataset for the given (fractional) year.
    function insertData(year) {
        return honeyData.map(function (d) {
            return {
                state: d.state,
                totalprod: insertValues(d.totalprod, year),
                priceperlb: insertValues(d.priceperlb, year),
                numcol: insertValues(d.numcol, year)
            };
        });
    }

    // Positions the dots based on data.
    function position(circle) {
        circle.attr("cx", function (d) { return xLinearScale(x(d)); })
            .attr("cy", function (d) { return yLinearScale(y(d)); })
            // .attr("r", function (d) { return radiusScale(radius(d)); })
            .attr('r', 5);
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    // Finds (and possibly interpolates) the value for the specified year.
    function insertValues(values, year) {
        let i = bisect.left(values, year, 0, values.length - 1),
            a = values[i];

        // console.log(i);
        // console.log(a);
        // if (i > 0) {
        //     let b = values[i - 1],
        //         t = (year - a[0]) / (b[0] - a[0]);
        //     return a[1] * (1 - t) + b[1] * t;
        // }
        return a[1];
    }
});