let url = '/honey-pest';

(function () {
    Plotly.d3.json(url, function (error, data) {
        // Create a lookup table to sort and regroup the columns of data,
        // first by year, then by state:
        if (error) throw error;

        // console.log(data);

        let lookup = {};

        function getData(year, state) {
            let byYear, trace;
            if (!(byYear = lookup[year])) {
                ;
                byYear = lookup[year] = {};
            }
            // If a container for this year + state doesn't exist yet,
            // then create one:
            if (!(trace = byYear[state])) {
                trace = byYear[state] = {
                    x: [],
                    y: [],
                    id: [],
                    text: [],
                    marker: { size: [] }
                };
            }
            return trace;
        }

        // Go through each row, get the right trace, and append the data:
        for (let i = 0, ii = data.length; i < ii; i++) {
            let datum = data[i];
            let trace = getData(datum.year, datum.state);
            trace.text.push(`State: ${datum.state_name}<br>Total Production: ${datum.totalprod} lbs<br>Price per Pound: $${datum.priceperlb}<br>Number of Colonies: ${datum.numcol}<br>Total Insecticide: ${datum.totalpest} kg`);
            trace.id.push(datum.state);
            trace.x.push(datum.totalprod);
            trace.y.push(datum.priceperlb);
            trace.marker.size.push(datum.numcol);
        }

        // Get the group names:
        let years = Object.keys(lookup);

        // In this case, every year includes every state, so we
        // can just infer the states from the *first* year:
        let firstYear = lookup[years[0]];
        let states = Object.keys(firstYear);

        // Create the main traces, one for each state:
        let traces = [];

        for (let i = 0, ii = states.length; i < ii; i++) {
            let data = firstYear[states[i]];
            // We're creating a single trace here, to which
            // the frames will pass data for the different years. It's
            // subtle, but to avoid data reference problems, we'll slice
            // the arrays to ensure we never write any new data into our
            // lookup table:
            traces.push({
                name: states[i],
                x: data.x.slice(),
                y: data.y.slice(),
                id: data.id.slice(),
                text: data.text.slice(),
                mode: 'markers',
                marker: {
                    size: data.marker.size.slice(),
                    sizemode: 'area',
                    sizeref: 80
                    // Recommended calculation: sizeref = 2 * Plotly.d3.max(array of size values) / (desired maximum marker size ** 2)
                }
            });
        }

        // Create a frame for each year. Frames are effectively just
        // traces, except they don't need to contain the *full* trace
        // definition (for example, appearance). The frames just need
        // the parts the traces that change (here, the data).
        let frames = [];

        for (let i = 0, ii = years.length; i < ii; i++) {
            frames.push({
                name: years[i],
                data: states.map(function (state) {
                    return getData(years[i], state);
                })
            })
        }

        // Now create slider steps, one for each frame. The slider
        // executes a plotly.js API command (here, Plotly.animate).
        // In this example, we'll animate to one of the named frames
        // created in the above loop.
        let sliderSteps = [];

        for (i = 0, ii = years.length; i < ii; i++) {
            sliderSteps.push({
                method: 'animate',
                label: years[i],
                args: [[years[i]], {
                    mode: 'immediate',
                    transition: { duration: 800 },
                    frame: { duration: 800, redraw: false },
                }]
            });
        }

        let layout = {
            xaxis: {
                title: 'Total Production (lbs)',
                range: [-2000000, 50000000]
            },
            yaxis: {
                range: [-1.5, 8.5]
            },
            hovermode: 'closest',
            // We'll use updatemenus (whose functionality includes menus as
            // well as buttons) to create a play button and a pause button.
            // The play button works by passing `null`, which indicates that
            // Plotly should animate all frames. The pause button works by
            // passing `[null]`, which indicates we'd like to interrupt any
            // currently running animations with a new list of frames. Here
            // The new list of frames is empty, so it halts the animation.
            updatemenus: [{
                x: 0,
                y: 0,
                yanchor: 'top',
                xanchor: 'left',
                showactive: false,
                direction: 'left',
                type: 'buttons',
                pad: { t: 115, r: 10 },
                buttons: [{
                    method: 'animate',
                    args: [null, {
                        mode: 'immediate',
                        fromcurrent: true,
                        transition: { duration: 1e9 },
                        frame: { duration: 800, redraw: false }
                    }],
                    label: 'Play'
                }, {
                    method: 'animate',
                    args: [[null], {
                        mode: 'immediate',
                        transition: { duration: 0 },
                        frame: { duration: 0, redraw: false }
                    }],
                    label: 'Pause'
                }]
            }],
            // Finally, add the slider and use `pad` to position it
            // nicely next to the buttons.
            sliders: [{
                pad: { l: 130, t: 55 },
                currentvalue: {
                    visible: true,
                    prefix: 'Year:',
                    xanchor: 'right',
                    font: { size: 50, color: 'black' }
                },
                steps: sliderSteps
            }],
            height: 650,
            margin: {
                r: 120,
                t: 100
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
                family: 'Oswald',
                color: 'black'
            }
        };

        // Create the plot:
        Plotly.plot('bubble-plot', {
            data: traces,
            layout: layout,
            frames: frames,
        });

        // Create y axis labels, values, etc. lists
        let yLabels = ['Price per Pound ($)', 'Total Pesticide (kg)'],
            yValues = ['priceperlb', 'totalpest'],
            yOnClick = ['remakePlot(this)', 'remakePlot(this)'];

        let $yTextGroup = Plotly.d3.select('.main-svg')
            .append('g')
            .classed('g-ytitle', true);

        // Append y-axis labels
        for (let i = 0, ii = yLabels.length, spacer = 0; i < ii; i++ , spacer += 20) {
            $yTextGroup.append('text')
                .classed('ytitle', true)
                .attr('transform', 'rotate(-90,42,285.5)')
                .attr('x', '42')
                .attr('y', 260.5 + spacer)
                .attr('text-anchor', 'middle')
                .text('Total Pesticide (kg)')
                .style('font-family', 'Oswald')
                .style('font-size', '14px')
                .style('fill', 'rgb(0, 0, 0')
                .attr('value', yValues[i])
                .attr('onclick', yOnClick[i])
                .text(yLabels[i]);
        }

        // Generate toggle log button
        Plotly.d3.select('#toggle-btn')
            .append('button')
            .attr('type', 'button')
            .classed('btn btn-danger btn-sm', true)
            .attr('onclick', 'toggleXAxis()')
            .text('Toggle Log of X Axis')
    });
})();


// Toggle log of x axis
function toggleXAxis() {
    let $bubblePlot = Plotly.d3.select('#bubble-plot');

    let logClass = $bubblePlot.classed('log-x-axis');

    if (logClass) {
        let update = {
            xaxis: {
                title: 'Total Production (lbs)',
                range: [-2000000, 50000000]
            }
        }

        Plotly.relayout('bubble-plot', update);

        $bubblePlot
            .classed('log-x-axis', false)
            .classed('x-axis', true);
    }
    else {
        let update = {
            xaxis: {
                title: 'Total Production (lbs)',
                type: 'log'
            }
        }

        Plotly.relayout('bubble-plot', update);

        $bubblePlot
            .classed('x-axis', false)
            .classed('log-x-axis', true);
    }
}


function remakePlot(object) {

    // Grab text object value
    let $yValue = object.getAttribute('value');

    let yRange;

    if ($yValue === 'totalpest') {
        yRange = [-100000, 450000];
    }
    else if ($yValue === 'priceperlb') {
        yRange = [-1.5, 8.5];
    }

    Plotly.d3.json(url, function (error, data) {

        if (error) throw error;

        // console.log(data);

        // Create a lookup table to sort and regroup the columns of data,
        // first by year, then by state:
        let lookup = {};

        function getData(year, state) {
            let byYear, trace;
            if (!(byYear = lookup[year])) {
                ;
                byYear = lookup[year] = {};
            }
            // If a container for this year + state doesn't exist yet,
            // then create one:
            if (!(trace = byYear[state])) {
                trace = byYear[state] = {
                    x: [],
                    y: [],
                    id: [],
                    text: [],
                    marker: { size: [] }
                };
            }
            return trace;
        }

        // Go through each row, get the right trace, and append the data:
        for (let i = 0, ii = data.length; i < ii; i++) {
            let datum = data[i];
            let trace = getData(datum.year, datum.state);
            trace.text.push(`State: ${datum.state_name}<br>Total Production: ${datum.totalprod} lbs<br>Price per Pound: $${datum.priceperlb}<br>Number of Colonies: ${datum.numcol}<br>Total Insecticide: ${datum.totalpest} kg`);
            trace.id.push(datum.state);
            trace.x.push(datum.totalprod);
            trace.y.push(datum[$yValue]);
            trace.marker.size.push(datum.numcol);
        }

        // Get the group names:
        let years = Object.keys(lookup);

        // In this case, every year includes every state, so we
        // can just infer the states from the *first* year:
        let firstYear = lookup[years[0]];
        let states = Object.keys(firstYear);

        // Create the main traces, one for each state:
        let traces = [];

        for (let i = 0, ii = states.length; i < ii; i++) {
            let data = firstYear[states[i]];

            traces.push({
                name: states[i],
                x: data.x.slice(),
                y: data.y.slice(),
                id: data.id.slice(),
                text: data.text.slice(),
                mode: 'markers',
                marker: {
                    size: data.marker.size.slice(),
                    sizemode: 'area',
                    sizeref: 80
                    // Recommended calculation: sizeref = 2 * Plotly.d3.max(array of size values) / (desired maximum marker size ** 2)
                }
            });
        }

        let frames = [];

        for (let i = 0, ii = years.length; i < ii; i++) {
            frames.push({
                name: years[i],
                data: states.map(function (state) {
                    return getData(years[i], state);
                })
            })
        }

        let sliderSteps = [];

        for (i = 0, ii = years.length; i < ii; i++) {
            sliderSteps.push({
                method: 'animate',
                label: years[i],
                args: [[years[i]], {
                    mode: 'immediate',
                    transition: { duration: 800 },
                    frame: { duration: 800, redraw: false },
                }]
            });
        }

        let layout = {
            xaxis: {
                title: 'Total Production (lbs)',
                range: [-2000000, 50000000]
                // type: 'log'
            },
            yaxis: {
                // title: 'Price per Pound ($)',
                range: yRange
            },
            hovermode: 'closest',
            updatemenus: [{
                x: 0,
                y: 0,
                yanchor: 'top',
                xanchor: 'left',
                showactive: false,
                direction: 'left',
                type: 'buttons',
                pad: { t: 115, r: 10 },
                buttons: [{
                    method: 'animate',
                    args: [null, {
                        mode: 'immediate',
                        fromcurrent: true,
                        transition: { duration: 1e9 },
                        frame: { duration: 800, redraw: false }
                    }],
                    label: 'Play'
                }, {
                    method: 'animate',
                    args: [[null], {
                        mode: 'immediate',
                        transition: { duration: 0 },
                        frame: { duration: 0, redraw: false }
                    }],
                    label: 'Pause'
                }]
            }],
            // Finally, add the slider and use `pad` to position it
            // nicely next to the buttons.
            sliders: [{
                pad: { l: 130, t: 55 },
                currentvalue: {
                    visible: true,
                    prefix: 'Year:',
                    xanchor: 'right',
                    font: { size: 50, color: 'black' }
                },
                steps: sliderSteps
            }],
            height: 650,
            margin: {
                r: 120,
                t: 100
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
                family: 'Oswald',
                color: 'black'
            }
        };

        Plotly.react('bubble-plot', {
            data: traces,
            layout: layout,
            frames: frames,
        });
    });
}