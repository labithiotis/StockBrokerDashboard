import app from './app';
import Pusher from 'pusher-js';

Pusher.log = function(message) {
	if (window.console && window.console.log) {
		window.console.log(message);
	}
};

let pusher = new Pusher('f93950db757aaa7c02c2');

// Menu Product Updates
let menu = pusher.subscribe('menu');

menu.bind('update', function(product) {
	app.collections.products.add(product);
});

export default pusher;