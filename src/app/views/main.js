import Backbone from 'backbone';
import $ from 'jquery';
import Isotope from 'isotope-layout';
import IsotopePackery from 'isotope-packery';

import ProductView from './product'
import MainTemplate from '../templates/main.hbs';

export default class MainView extends Backbone.View {

	get id() { return 'main'; }

	get events() {
		return {
			'keypress': 'sortGrid'
		};
	}

	constructor(options) {
		super(options);

		this.listenTo(this.app.collections.products, 'update', this.render);
	}

	render() {

		logger('render main');

		this.$el.html(MainTemplate());

		this.$grid = $('.grid', this.$el);

		this.addProducts();

		this.initIsotope();

		this.startRandomShuffle();

		return this;

	}

	addProducts() {

		this.$grid.html('<div class="grid-gutter"></div><div class="grid-sizer"></div>');

		this.app.collections.products.each(product => {

			logger('Add product to grid %s', product.get('name'));

			let productView = new ProductView({model: product}).render();

			productView.parent = this;

			this.$grid.append(productView.$el);

		});

	}

	initIsotope() {

		this.isotope = new Isotope(this.$grid[0], {
			layoutMode: 'packery',
			itemSelector: '.grid-item',
			percentPosition: true,
			packery: {
				columnWidth: '.grid-sizer',
				gutter: '.grid-gutter'
			},
			getSortData: {
				time: '[data-time]'//,
				//featured: '[data-featured]',
				//up: '[data-up]',
				//down: '[data-down]',
				//same: '[data-same]',
				//percentage: '[data-percentage]'
			},
			sortBy: 'time'
		});

		//this.isotope({sortBy: 'time'})

	}

	sortGrid(e) {
		var code = e.keyCode || e.which;
		switch(code) {
			case(49): alert(1); break;
			case(50): alert(2); break;
			case(51): alert(3); break;
			case(52): alert(4); break;
			case(53): alert(5); break;
		}

	}

	startRandomShuffle() {

		clearInterval(this.randomTimer);

		this.randomTimer = setInterval(this.randomShuffle.bind(this), 30000)

	}

	randomShuffle() {

		this.isotope.shuffle()

	}

	newsTicker() {

	}

}