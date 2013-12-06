///<reference path='../vendor/dt-handlebars/handlebars.d.ts'/>
var handlebars: HandlebarsStatic = require('../node_modules/handlebars');
import base = require('./base');


export class Handlebars extends base.TemplatingEngineLoader {
	constructor(engineClass?: typeof base.TemplatingEngine, scriptPath?: string) {
		super(engineClass || HandlebarsEngine, scriptPath);
	}
}

export class HandlebarsEngine extends base.TemplatingEngine {
	hb: any;

	constructor() {
		super();
		this.hb = handlebars;
	}

	compile(source: string, callback: Function) {
		callback(this.hb.compile(source));
	}
}
