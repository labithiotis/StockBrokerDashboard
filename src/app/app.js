import Backbone from 'backbone';
import pusher from './pusher';
import Products from './models/products';

var app = {
	collections: {
		products: new Products()
	},
	pusher: pusher
};

Backbone.Router.prototype.app = Backbone.Model.prototype.app = Backbone.Collection.prototype.app = Backbone.View.prototype.app = app;

export default app


// EXPOSE FOR DEBUG
window.app = app;