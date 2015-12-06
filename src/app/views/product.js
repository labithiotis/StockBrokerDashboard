import $ from 'jquery';
import Backbone from 'backbone';
import numeral from 'numeral';
import fitterHappierText from 'fitter-happier-text';

import ProductTemplate from '../templates/product.hbs';

export default class ProductView extends Backbone.View {

	get className() {
		return 'grid-item product'
	}

	constructor(options) {
		super(options);
		this.listenTo(this.model, 'change', this.update);
	}

	update() {
		this.render();
		this.parent.isotope.layout();
		//this.parent.isotope.sortBy('time');
	}

	render() {

		this.el.className = 'grid-item product';

		console.log('Render product: #%s', this.model.id);

		let data = this.model.toJSON();

		console.log(data);

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

		if(data.percent_change <= -50) {
			this.$el.addClass('featured');
			this.$el.attr('data-featured', true);
		} else {
			this.$el.removeClass('featured');
			this.$el.attr('data-featured', false);
		}

		this.$el.attr('data-id', data.id);
		this.$el.attr('data-time', data.timestamp);
		this.$el.attr('data-percentage', data.percent_change);

		data.price = '£' + numeral((data.price || 0) / 100).format('0,0.00');
		data.sale_price = '£' + numeral((data.sale_price || 0) / 100).format('0,0.00');

		this.$el.html(ProductTemplate(data));

		fitterHappierText($('.product-name', this.$el)[0]);

		this.renderHistoryChart();

		return this;

	}

	getHistoryData() {

		return [{
			area: true,
			values: this.model.get('hisotry') || [],
			key: "History",
			color: "#ffffff",
			strokeWidth: 2,
			classed: 'dashed'
		}]

	}

	renderHistoryChart() {

		this.chart = nv.addGraph( () => {

			var chart = nv.models.lineChart()
					.options({
						transitionDuration: 300,
						useInteractiveGuideline: false
					});

			chart.showXAxis(false);
			chart.showYAxis(false);

			let el = $('.chart', this.el)[0]

			d3.select(el).append('svg')
					.datum(this.getHistoryData())
					.call(chart);

			nv.utils.windowResize(chart.update);

			return chart;

		});

	}

}