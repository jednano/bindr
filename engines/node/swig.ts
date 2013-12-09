import base = require('../base');
var swig = new (require('swig')).Swig();


export class Swig extends base.TemplatingEngine {

	swig = swig;

	constructor(scriptPath?: string) {
		super(scriptPath);
	}

	compile(source: string, callback: Function) {
		callback(context => {
			return this.swig.render(source, context);
		});
	}
}
