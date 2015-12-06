window.debug = true;

window.logger = function() {
	if(window.debug) console.log.apply(console, arguments);
};

export default debug;
