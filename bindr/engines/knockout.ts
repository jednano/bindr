import base = require('./base');


export class Knockout extends base.TemplatingEngineLoader {
	constructor() {
		super(KnockoutEngine, './vendor/knockoutjs/index.js');
	}
}

export class KnockoutEngine extends base.TemplatingEngine {
	ko: any;

	constructor() {
		super();
		this.ko = this.window.ko;
	}

	compile(source: string, callback: Function) {
		var doc = this.helpers.createDocumentFragment(source);
		callback(data => {
			return this.ko.applyBindings(data, doc);
		});
	}
}
