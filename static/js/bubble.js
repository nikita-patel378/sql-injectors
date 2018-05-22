let svgWidth = 960;
let svgHeight = 635;

let margin = {
    top: 45,
    right: 30,
    bottom: 130,
    left: 130
};

let chartWidth = svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;

let $svg = d3.select('#plot')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

let $chartGroup = $svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

let url = '/data';

d3.json(url, (error, honeyData) => {
    if (error) throw error;

    console.log(honeyData);

    // Create scale functions
    let xLinearScale = d3.scaleLinear()
        .domain(d3.extent(honeyData, data => data.year))
        .range([0, chartWidth]);

    let yLinearScale = d3.scaleLinear()
        .domain(d3.extent(honeyData, data => data.totalprod))
        .range([chartHeight, 0]);

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


    // Create default plot
    function createDefault() {
        // // Set x and y axes text activity
        // $xAxisLabel.classed('inactive', true);
        // $yAxisLabel.classed('inactive', true);

        // d3.select(`.x-axis-text[data-value='median_income']`)
        //     .classed('inactive', false)
        //     .classed('active', true);

        // d3.select(`.y-axis-text[data-value='physically_active']`)
        //     .classed('inactive', false)
        //     .classed('active', true);

        // Create a group for the circles
        let $circleGroup = $chartGroup.append('g');

        $circleGroup.selectAll('circle')
            .data(honeyData)
            .enter()
            .append('circle')
            .attr('cx', data => xLinearScale(data.year))
            .attr('cy', data => yLinearScale(data.totalprod))
            .attr('r', '15')
            .attr('fill', 'rgb(75, 133, 142)')
            .attr('opacity', '0.9');

        // Create a group for the text in each circle
        let $circleTextGroup = $chartGroup.append('g');

        $circleTextGroup.selectAll('text')
            .data(honeyData)
            .enter()
            .append('text')
            .attr('x', data => xLinearScale(data.year))
            .attr('y', data => yLinearScale(data.totalprod))
            .classed('state-abbrev', true)
            .text(data => data.state);

        // updateTooltip();
    }


    // Generate default plot
    createDefault();
});