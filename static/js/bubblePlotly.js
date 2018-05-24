let url = '/data'

Plotly.d3.json(url, function (error, data) {
    // Create a lookup table to sort and regroup the columns of data,
    // first by year, then by state:
    if (error) throw error;

    console.log(data);

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
        trace.text.push(datum.state);
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
    for (i = 0; i < states.length; i++) {
        let data = firstYear[states[i]];
        // One small note. We're creating a single trace here, to which
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
                sizeref: 50
            }
        });
    }

    // Create a frame for each year. Frames are effectively just
    // traces, except they don't need to contain the *full* trace
    // definition (for example, appearance). The frames just need
    // the parts the traces that change (here, the data).
    let frames = [];
    for (i = 0; i < years.length; i++) {
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
    for (i = 0; i < years.length; i++) {
        sliderSteps.push({
            method: 'animate',
            label: years[i],
            args: [[years[i]], {
                mode: 'immediate',
                transition: { duration: 300 },
                frame: { duration: 300, redraw: false },
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
            title: 'Price per Pound ($/lb)',
            range: [-0.5, 5]
        },
        height: 600,
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
            pad: { t: 87, r: 10 },
            buttons: [{
                method: 'animate',
                args: [null, {
                    mode: 'immediate',
                    fromcurrent: true,
                    transition: { duration: 300 },
                    frame: { duration: 500, redraw: false }
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
                font: { size: 20, color: '#666' }
            },
            steps: sliderSteps
        }]
    };

    // Create the plot:
    Plotly.plot('bubble-plotly', {
        data: traces,
        layout: layout,
        frames: frames,
    });
});