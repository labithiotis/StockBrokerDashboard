import Backbone from 'backbone';
import _ from 'underscore';

let Product = exports.product = class Product extends Backbone.Model {

	get defaults() {
		return {
			name: '',
			price: 0,
			sale_price: 0,
			percentage_change: 0,
			history: [],
			timestamp: new Date().getTime()
		};
	}

};

export default class Products extends Backbone.Collection {

	model:Product;

	get url() {
		return 'https://hack.boppl.me/api/menu?merchant_id=VW84GMYHDGGRE'
	}

	parse(r) {
		_.each(r, (p)=> { p.timestamp = new Date().getTime() });
		return r;
	}

}