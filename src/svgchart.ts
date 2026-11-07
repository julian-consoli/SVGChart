/**
 * Base class for SVG charts.
 * 
 * @remarks
 * Recommended to not override the constructor when extending this class.
 * 
 * @param id 
 * The ID of the container element where the chart will be injected.
 * @param allowEmpty
 * Choose whether or not to include datasets with no values.
 * @param format
 * An optional overload to format a display value of the data.
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options|Intl.NumberFormat}
 * for syntax
 * @param name
 * The name to be associated with the data.
 * @param data 
 * The dataset to be plotted.
 */
class SvgChart {
	/**
	 * The ID value of the chart container used to queryselect the element.
	 * @readonly
	 */
	readonly selector: string;
	/**
	 * The element that wraps the chart.
	 * @readonly
	 */
	readonly container: Element;
	/**
	 * Allow/disallow empty datasets.
	 * @readonly
	 */
	readonly allowEmpty: boolean = false;
	/**
	 * Formats the values within the dataset.
	 */
	private _valueFormat: Intl.NumberFormat = new Intl.NumberFormat();
	/**
	 * A collection of the data to be plotted on the chart.
	 */
	private _dataset: Map<string, SvgChartData> = new Map<string, SvgChartData>();

	constructor(id: string, allowEmpty: boolean = false, format?: Intl.NumberFormat, name?: string, data?: Array<Datapoint>) {
		const container = document.querySelector('#' + id);
		if (!id || !container)
			throw new Error('Element not found using the supplied ID.');

		this.selector = id;
		this.container = container;
		this.allowEmpty = allowEmpty;

		if (format) this.updateValueFormat(format);

		if (data?.length) this.updateDataset(name || "Chart", data);
	}

	//#region Getters / Setters
	public get dataset(): Map<string, SvgChartData> { return this._dataset; }
	public set dataset(data: [string, Array<Datapoint>]) { this.updateDataset(data[0], data[1]); }

	public get valueFormat(): Intl.NumberFormat { return this._valueFormat }
	public set valueFormat(format: Intl.NumberFormat) { this.updateValueFormat(format); }
	//#endregion

	//#region Methods
	/**
	 * Parses the supplied dataset, orders the values according to name -> sort 
	 * order, applies theming, and collects statistcs.
	 * 
	 * @param data
	 * An array of datapoints to add.
	 */
	private updateDataset(name: string, data: Array<Datapoint>) {
		if (!this.allowEmpty && !Boolean(data.length)) {
			if (this._dataset.has(name))
				this._dataset.delete(name);
			return;
		}

		const dataSorted = (
			data || []
		).sort((a: Datapoint, b: Datapoint) =>
			b.value - a.value
		).sort((a: Datapoint, b: Datapoint) =>
			(a?.order || 0) - (b?.order || 0)
		).map((d: Datapoint, i: number) => {
			d.name = d.name.replace(/\W+/g, '-').toLowerCase();
			d.formatted = this._valueFormat.format(d.value);
			d.color = `var(--chart-data-color-${i}, var(--chart-data-color-base))`;

			return d;
		});

		const values: Array<number> = dataSorted.map((d: Datapoint) => d.value).filter(Boolean);

		this._dataset.set(name, {
			values: dataSorted,
			total: values.reduce((t: number, v: number) => t + v),
			count: values.length
		});
	}

	private updateValueFormat(format?: Intl.NumberFormat) {
		this._valueFormat = format || new Intl.NumberFormat();

		this._dataset.forEach((data: SvgChartData, k: string) => {
			const reformattedData: Array<Datapoint> = data.values.map((d: Datapoint) => ({
				...d,
				formatted: this._valueFormat.format(d.value)
			}));

			this._dataset.set(k, {
				...data,
				values: reformattedData
			});
		})
	}
	//#endregion
}

/**
 * A sub-class for `SvgChart` that is designed to display data in a "pie" or
 * "donut" shaped chart.
 * 
 * @remarks
 * Only supports display of a single dataset.
 */
class SvgCircleChart extends SvgChart {
	/**
	 * The diameter of the circle chart.
	 * 
	 * @remarks
	 * Also controls the width and height of the SVG viewBox.
	 */
	private readonly _diameter: number = 100;
	/**
	 * A constant for the center point of the drawn SVG.
	 */
	private readonly _origin: number = this._diameter * 0.5;
	/**
	 * The width of the path stroke.
	 * 
	 * @remarks
	 * Also used for the radius offset calculation so the stroke does not 
	 * get clipped.
	 * The stroke width can also be overridden using the CSS variable, but
	 * will not impact the viewBox.
	 */
	private readonly _strokeSize: number = 3;
	/**
	 * A constant for the radius of the drawn SVG.
	 */
	private readonly _radius: number = this._origin - this._strokeSize;
	/**
	 * The fractional size of the inner circle used to create a 'donut' chart.
	 */
	private readonly _innerSize: number = Math.round(this._radius * 0.65);

	/**
	 * The main method. Will inject an SVG element in the container determined
	 * on class initialization.
	 * 
	 * @param style
	 * The format of the chart (e.g., Pie Chart, Donut Chart).
	 */
	public buildChart(style: 'pie' | 'donut' = 'pie') {
		const first = this.dataset.entries().next().value;
		if (!first)
			throw new Error("Unable to build SvgChart; no data available.");

		const [chartName, chartData] = first;
		const chartId = chartName.replace(/\W+/g, '-').toLowerCase();

		const svgElem: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgElem.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
		svgElem.setAttribute('viewBox', `0 0 ${this._diameter} ${this._diameter}`);
		svgElem.setAttribute('id', chartId);
		svgElem.classList.add('svg-chart', style);

		const titleElem: SVGTitleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
		titleElem.textContent = chartName;
		svgElem.appendChild(titleElem);

		let cumulativePercentage: number = 0;

		chartData.values.forEach((data: Datapoint) => {
			const percent: number = data.value / (chartData.total || 1);

			const angleStart = (Math.PI * -0.5) + (2 * Math.PI * cumulativePercentage);
			const [arcStartX, arcStartY] = this.getCoordsFromRadians(angleStart);

			const angleEnd = angleStart + (2 * Math.PI * percent);
			const [arcEndX, arcEndY] = this.getCoordsFromRadians(angleEnd);

			cumulativePercentage += percent;

			// Whether or not the slice should take the longer arc (e.g., extends beyond 180deg of the circle)
			const largeArcFlag: number = percent > 0.5 ? 1 : 0;

			const pathData: string = [
				`M ${arcStartX} ${arcStartY}`,
				`A ${this._radius} ${this._radius} 0 ${largeArcFlag} 1 ${arcEndX} ${arcEndY}`,
				`L ${this._origin} ${this._origin}`,
				'Z'
			].join(' ');

			svgElem.appendChild(this.generateSvgNodes(chartId, data, pathData));
		});

		if (style === 'donut') {
			const donutHole: SVGCircleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			donutHole.setAttribute('cx', this._origin + '');
			donutHole.setAttribute('cy', this._origin + '');
			donutHole.setAttribute('r', this._innerSize + '');
			donutHole.setAttribute('stroke', 'var(--chart-border-color, black)');
			donutHole.setAttribute('stroke-width', `var(--chart-border-width, ${this._strokeSize}px)`);
			donutHole.setAttribute('fill', 'var(--chart-bg, white)');
			svgElem.appendChild(donutHole);
		}

		this.container.textContent = '';
		this.container.appendChild(svgElem);
	}

	//#region Methods
	/**
	 * Gets a set of coordinates for drawing the 'pie slice'.
	 * 
	 * @param angle
	 * The radian value of the angle of the 'pie slice'.
	 * 
	 * @returns
	 * A tuple of 'X' and 'Y' coordinates.
	 */
	private getCoordsFromRadians(angle: number): [number, number] {
		const x = (Math.cos(angle) * this._radius) + this._origin;
		const y = (Math.sin(angle) * this._radius) + this._origin;

		return [x, y];
	}

	/**
	 * Generates HTML of a 'slice' of the chart.
	 * 
	 * @param data
	 * The datapoint statistics and info.
	 * @param
	 * The path to draw.
	 * 
	 * @returns
	 * An SVG 'group' element with the path and accessible title.
	 */
	private generateSvgNodes(chartId: string, data: Datapoint, path: string): SVGGElement {
		const groupElem: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		groupElem.setAttribute('id', `${chartId}_data_${data.name}`);
		// TBA - Event handling

		const pathElem: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		pathElem.setAttribute('d', path);
		pathElem.setAttribute('fill', data.color ?? 'var(--chart-data-color-base)');
		pathElem.setAttribute('stroke', 'var(--chart-border-color, black)');
		pathElem.setAttribute('stroke-width', 'var(--chart-border-width, 3px)');
		pathElem.setAttribute('stroke-linecap', 'round');
		pathElem.setAttribute('stroke-linejoin', 'round');
		groupElem.appendChild(pathElem);

		const titleElem: SVGTitleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
		titleElem.textContent = (data.title || data.name) + ": " + (data.formatted || data.value);
		groupElem.appendChild(titleElem);

		return groupElem;
	}
	//#endregion
}
