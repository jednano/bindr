var Handlebars = require('handlebars');


Handlebars.registerHelper('link_to', function() {
	return '<a href="' + this.url + '">' + this.body + '</a>';
});

module.exports = {
	compile: function(source) {
		return {
			done: Handlebars.compile(source)
		};
	}
};
