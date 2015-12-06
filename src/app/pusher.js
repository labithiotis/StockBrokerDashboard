import app from './app';
import Pusher from 'pusher-js';
import _ from 'underscore';

Pusher.log = function(message) {
	if(window.console && window.console.log) {
		window.console.log(message);
	}
};

let pusher = new Pusher('f93950db757aaa7c02c2');

// Menu Product Updates
let menu = pusher.subscribe('menu');

menu.bind('update', function(products) {
	_.each(products, (product) => { product.timestamp = new Date().getTime() } );
	app.collections.products.add(products, {merge: true});
});

export default pusher;