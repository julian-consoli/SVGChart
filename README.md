# About SVG Chart
This is a little personal project for a low-code, zero-dependency, chart/graph generation in a web browser. It ain't all fancy like the 
other plugins on the interwebs, but it doesn't mean to be. Sometimes you just want a simple graphic that maps your data, and that is
what you'll get with this.

This project is a work in progress. I will update it when I feel like it.

## Getting Started
### Build
Done in three easy steps.
1. `npm i` (Used NodeJS 24.22.0)
2. `npm run build`
3. Grab the file from the `dist` directory

### Install
Add the file to your site/web app. 'Nuff said.

### Example Usage 
```
const chartElem = document.createElement('div');
chartElem.setAttribute('id', 'chart');

document.body.appendChild(chartElem);

const chart = new SvgCircleChart(
    'chart',
    [],
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })
);

chart.dataset = [
    {
        name: 'datapoint-a',
        value: 350,
        title: "Datapoint A"
    },
    {
        name: 'datapoint-b',
        value: 750,
        title: "Datapoint B"
    },
    {
        name: 'datapoint-c',
        value: 200,
        title: "Datapoint C"
    }
];
chart.buildChart('pie');  
```

## Tools Used
Good ole fashioned organic coding. No bots wanted or needed.

## License
Feel free to use or transform as you see fit. See `LICENSE.txt` for more information.

## Acknowledgements
IYKYK - Thanks for the feedback! =)