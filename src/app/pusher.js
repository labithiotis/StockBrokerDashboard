import app from './app';
import Pusher from 'pusher-js';
import _ from 'underscore';

Pusher.log = (message) => {
	if(logger) logger(message);
};

let pusher = new Pusher('5577ecaa27f974815b3b');

// Menu Product Updates
//let menu = pusher.subscribe('menu');

pusher.subscribe('menu').bind('update', (products) => {
	_.each(products, (product) => { product.timestamp = new Date().getTime() } );
	app.collections.products.add(products, {merge: true});
});

pusher.subscribe('system').bind('update', (products) => {
	window.location.reload();
});

export default pusher;