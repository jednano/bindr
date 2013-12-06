///<reference path='../../vendor/dt-node/node.d.ts'/>
///<reference path='../../vendor/dt-handlebars/handlebars.d.ts'/>
var handlebars: HandlebarsStatic = require('../../node_modules/handlebars');
import _Handlebars = require('../handlebars');


export class Handlebars extends _Handlebars.Handlebars {
	constructor() {
		super(HandlebarsEngine);
	}
}

export class HandlebarsEngine extends _Handlebars.HandlebarsEngine {
	constructor() {
		super();
		handlebars.registerHelper('link_to', function() {
			return '<a href="' + this.url + '">' + this.body + '</a>';
		});
		this.hb = handlebars;
	}
}
