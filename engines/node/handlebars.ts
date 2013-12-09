///<reference path='../../vendor/dt-handlebars/handlebars.d.ts'/>
import base = require('../base');
var hb: HandlebarsStatic = require('handlebars');


export class Handlebars extends base.TemplatingEngine {

	hb = hb;

	constructor(scriptPath?: string) {
		super(scriptPath);
	}

	compile(source: string, callback: Function) {
		callback(this.hb.compile(source));
	}
}
