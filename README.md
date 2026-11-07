# About SVG Chart
This is a little personal project for a low-code, zero-dependency, chart/graph generation in a web browser. It ain't all fancy like the 
other plugins on the interwebs, but it doesn't mean to be. Sometimes you just want a simple graphic that maps your data, and that is
what you'll get with this.

This project is a work in progress. I will update it when I feel like it.

## Getting Started
### Build
Done in three easy steps.
1. `npm i` (Used NodeJS 24.22.2)
2. `npm run build`
3. Grab the file from the `dist` directory

### Install
Add the file to your site/web app. 'Nuff said.

### Example Usage 
See [`src/sample.html`](/src/sample.html) for functioning examples.

The basic premise is to first initialize a "chart" class, like so:
```javascript
const chart = new SvgCircleChart(
	'my-chart',							// Your element ID where the chart will be injected
	false,								// Whether or not to allow empty values
	new Intl.NumberFormat('en-US', {	// Formatter for your data
		style: 'currency',
		currency: 'USD'
	}),
	"My Data",							// The name of the dataset
	[{									// The data to plot
		name: 'datapoint',
		value: 100,
		title: "Datapoint"
	}]
);
```

All arguments for the class constructor are optional except for the element ID. The formatter and datapoints can be set
after the fact using the getter/setter methods.
```javascript
chart.valueFormat = new Intl.NumberFormat('ja-JP', {
	style: 'currency',
	currency: 'JPY'
});

chart.dataset = [
	"My Data",
	[
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
	]
];
```

After the data has been set, simply run the `buildChart` method to draw the chart.
```javascript
chart.buildChart('pie');
```

## Tools Used
Good ole fashioned organic coding. No bots wanted or needed.

## Changelog
See [`CHANGELOG`](/CHANGELOG.md) for details.

## License
Feel free to use or transform as you see fit. See [`LICENSE`](/LICENSE) for more information.

## Acknowledgements
IYKYK - Thanks for the feedback! =)