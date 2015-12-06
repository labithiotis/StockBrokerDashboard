import $ from 'jquery';
import Backbone from 'backbone';
import _ from 'underscore';
import numeral from 'numeral';
//import fitterHappierText from 'fitter-happier-text';

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

		this.featured = data.percent_change <= -11;

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

		if(this.featured) {
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

		//fitterHappierText($('.product-name:first', this.$el));

		return this;

	}

	renderHistoryChart() {

		var $el = $('.chart', this.el);

		var width = this.featured ? 400 : 200;
		var height = this.featured ? 50 : 25;

		var yScale = d3.scale.linear().domain([-1, 1]);//.range([0, 10]);
		var yAxis = d3.svg.axis().scale(yScale);

		var xScale = d3.scale.linear().domain([0, 30]).rangeRound([0, width]);
		var xAxis = d3.svg.axis().scale(xScale);
		
		var lineFunction = d3
				.svg
				.line()
				.x(function(d) { return xScale(d.x) })
				.y(function(d) { return height - yScale(d.y) })
				.interpolate('monotone');

		var svgContainer = d3
				.select($el[0])
				.append('svg')
				.attr('width', width + 'px')
				.attr('height', height + 'px');

		var data = _.map(this.model.get('history') || [], (percent, i) => { return { y: percent*100, x: i +1 } });

		var lineGraph = svgContainer
				.append('path')
				.call(xAxis)
				.call(yAxis)
				.attr('d', lineFunction(data))
				.attr('stroke', '#F4D100')
				.attr('stroke-width', 2)
				.attr('fill', 'none');

	}

}