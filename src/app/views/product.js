import $ from 'jquery';
import Backbone from 'backbone';
import _ from 'underscore';
import numeral from 'numeral';
import fitterHappierText from 'fitter-happier-text';

import ProductTemplate from '../templates/product.hbs';

let featuredCount = 0;

export default class ProductView extends Backbone.View {

	get className() {
		return 'grid-item product'
	}

	constructor(options) {
		super(options);
		this.listenTo(this.model, 'change', this.update);
	}

	update() {
		let currentFeaturedCount = featuredCount;
		featuredCount = 0;
		this.render();
		if(currentFeaturedCount !== featuredCount) {
			logger('Re-layout grid');
			this.parent.isotope.layout();
		}
	}

	render() {

		this.el.className = 'grid-item product';

		logger('Render product: #%s', this.model.id);

		let data = this.model.toJSON();

		//logger(data);

		data.percent_change = parseInt(data.percent_change * 100);

		if(data.percent_change > 0) {
			this.$el.addClass('up');
			this.$el.attr('data-up', true);
		}

		if(data.percent_change < 0) {
			this.$el.addClass('down');
			this.$el.attr('data-down', true);
		}

		if(data.percent_change == 0 || !data.percent_change) {
			this.$el.addClass('same');
			this.$el.attr('data-same', true);
		}

		if(data.percent_change <= -20) {
			featuredCount ++;
			this.$el.addClass('featured');
			this.$el.attr('data-featured', true);
		} else {
			featuredCount --;
			this.$el.removeClass('featured');
			this.$el.attr('data-featured', false);
		}

		this.$el.attr('data-id', data.id);
		this.$el.attr('data-time', data.timestamp);
		this.$el.attr('data-percentage', data.percent_change);

		data.price = '£' + numeral((data.price || 0) / 100).format('0,0.00');
		data.sale_price = '£' + numeral((data.sale_price || 0) / 100).format('0,0.00');

		this.$el.html(ProductTemplate(data));



		this.renderHistoryChart();

		return this;

	}

	getHistoryData() {

		return [{
			area: false,
			values: _.map(this.model.get('history') || [], (price, i) => { return { y: price, x: i +1 } }),
			key: "History",
			color: "#F4D100",
			strokeWidth: 1,
			//fillOpacity: .1
		}]

	}

	renderHistoryChart() {

		//$('.chart .nvd3-svg', this.el).remove();

		this.chart = nv.addGraph( () => {

			var $el = $('.chart', this.el),
				width = parseInt($el.width(), 10),
				chart = nv.models.lineChart()
					.options({
						transitionDuration: 0,
						margin: {top: 10, right: 10, bottom: 10, left: 10},
						interactive: false,
						useInteractiveGuideline: false,
						showLegend: false,
						showXAxis: false,
						interpolate: 'monotone', // cardinal, basis, monotone
						//showYAxis: false,
						//yRange: [-1, 0, 1],
						xRange: [1, 120]
					});

			chart.yAxis.scale().domain([-0.75, 0, 0.75]);
			chart.showYAxis(false);

			var x = d3.scale.linear()
					.range([0, width])
					.domain([0, .4]);

			chart.y(function (d) { return d.y; });

			//logger(this.getHistoryData());

			d3.select($el[0]).append('svg')
					.datum(this.getHistoryData())
					.call(chart);

			nv.utils.windowResize(chart.update);

			return chart;

		});

	}

}