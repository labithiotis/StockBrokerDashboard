import Backbone from 'backbone';

export default class Router extends Backbone.Router {

	get routes() {
		return {
			'*path': 'default'
		};
	}

	initialize() {

		this.app.collections.products.fetch();


	}

	default(path = '') {
		// TODO: not yet implemented
	}

}
