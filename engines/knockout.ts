import base = require('./base');


export class Knockout extends base.TemplatingEngine {

	constructor(scriptPath?: string) {
		super(scriptPath || './vendor/knockoutjs/index.js');
	}

	compile(source: string, callback: Function) {
		this.load(source, window => {
			callback(context => {
				window.ko.applyBindings(context);
				return window.document.body.innerHTML;
			});
		});
	}
}
