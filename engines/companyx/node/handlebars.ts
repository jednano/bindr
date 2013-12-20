import _Handlebars = require('../../node/handlebars');


class Handlebars extends _Handlebars {

	constructor() {
		super();
		this.hb.registerHelper('link_to', function() {
			return '<a href="' + this.url + '">' + this.body + '</a>';
		});
	}
}

export = Handlebars;
