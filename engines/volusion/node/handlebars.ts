import base = require('../../base');
import _Handlebars = require('../../node/handlebars');


export class Handlebars extends _Handlebars.Handlebars {

	constructor() {
		super();
		this.hb.registerHelper('link_to', function() {
			return '<a href="' + this.url + '">' + this.body + '</a>';
		});
	}
}
