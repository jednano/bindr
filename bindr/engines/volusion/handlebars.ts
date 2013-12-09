import base = require('../base');
import _Handlebars = require('../handlebars');


export class Handlebars extends _Handlebars.Handlebars {
	constructor(engineClass?: typeof base.TemplatingEngine, scriptPath?: string) {
		super(engineClass || HandlebarsEngine, scriptPath);
	}
}

export class HandlebarsEngine extends _Handlebars.HandlebarsEngine {
	constructor() {
		super();
		this.hb.registerHelper('link_to', function() {
			return '<a href="' + this.url + '">' + this.body + '</a>';
		});
	}
}
