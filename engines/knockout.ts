import Engine = require('../lib/Engine');
import Promises = require('../lib/Promises');
var Deferred = Promises.Deferred;


class Knockout extends Engine {

	constructor(scriptPath?: string) {
		super(scriptPath || './vendor/knockoutjs/index.js');
	}

	compile(source: string): Promises.Promise {
		var compiling = new Deferred();
		this.load(source).done((window: any) => {
			compiling.resolve({
				render: this.onRender.bind(this, window)
			});
		});
		return compiling.promise;
	}

	private onRender(window: any, context: {}): Promises.Promise {
		var rendering = new Deferred();
		setTimeout(() => {
			var ko = window.ko;
			var body = window.document.body;
			ko.applyBindings(context);
			rendering.resolve(body.innerHTML);
		});
		return rendering.promise;
	}
}

export = Knockout;
