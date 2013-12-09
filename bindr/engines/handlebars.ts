import base = require('./base');


export class Handlebars extends base.TemplatingEngine {
	constructor(scriptPath?: string) {
		super(scriptPath || './vendor/handlebars/handlebars.js');
	}
	compile(source: string, callback: Function) {
		this.load('<html><body></body></html>', window => {
			var template = window.Handlebars.compile(source);
			callback(context => {
				return template(context);
			});
		});
	}
}
