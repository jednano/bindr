///<reference path='../../vendor/dt-node/node.d.ts'/>

var Handlebars = require('handlebars');


Handlebars.registerHelper('link_to', function() {
	return '<a href="' + this.url + '">' + this.body + '</a>';
});

exports.compile = source => {
	return {
		done: Handlebars.compile(source)
	};
};
