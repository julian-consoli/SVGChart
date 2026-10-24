/**
 * A collection of data values with additional statistics.
 */
type SvgChartData = {
    /**
     * The data to be plotted.
     */
    values: Array<Datapoint>;
    /**
     * The summation of the values.
     */
    total: number;
    /**
     * A shortcut for retrieving the number of datapoints.
     */
    count: number;
}

/**
 * Represents a singular item from a data set.
 */
type Datapoint = {
    /** 
     * A unique identifier for the datapoint.
     * 
     * @example
     * `dataOmega`
     */
    name: string;
    /**
     * The value plotted on the chart.
     * 
     * @example
     * `10`
     */
    value: number;
    /**
     * A display value derived from the supplied `value`.
     * 
     * @remarks
     * Formatting options defined on class initialization.
     * 
     * @example
     * `$10.00`
     */
    formatted: string;
    /**
     * An optional sequence interger for sorting.
     * 
     * @remarks
     * Dataset sorted alphabetically by `name` if not specified.
     * 
     * @example
     * `1`
     */
    order?: number
    /**
     * An optional "display name" to describe the data.
     * 
     * @example
     * `Data Omega`
     */
    title?: string;
    /**
     * An optional longer sentence to describe the data.
     * 
     * @example
     * `A short description.`
     */
    description?: string;
    /**
     * A valid CSS color used to style the datapoint representation.
     * 
     * @remarks
     * Value intended to be populated automatically on chart initialization.
     * 
     * @example
     * `red`, `#FF0000`, `rgba(255, 0, 0, 1)`, `var(--red)`
     */
    color?: string;
}