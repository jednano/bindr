///<reference path='../../vendor/dt-handlebars/handlebars.d.ts'/>
var handlebars: HandlebarsStatic = require('../../node_modules/handlebars');
import base = require('../base');


export class Handlebars extends base.TemplatingEngine {
	hb = handlebars;

	constructor(scriptPath?: string) {
		super(scriptPath);
	}

	compile(source: string, callback: Function) {
		callback(this.hb.compile(source));
	}
}
