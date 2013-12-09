import base = require('./base');


export class Knockout extends base.TemplatingEngineLoader {
	constructor(engineClass?: typeof base.TemplatingEngine, scriptPath?: string) {
		super(engineClass || KnockoutEngine, scriptPath || './vendor/knockoutjs/index.js');
	}
}

export class KnockoutEngine extends base.TemplatingEngine {
	compile(source: string, callback: Function) {
		var doc = this.helpers.createDocumentFragment(source);
		callback(context => {
			this.window.ko.applyBindings(context, doc);
			return doc.outerHTML;
		});
	}
}
