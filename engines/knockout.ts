import base = require('./base');
import Promises = require('../lib/Promises');
var Deferred = Promises.Deferred;


class Knockout extends base.TemplatingEngine {

	ko: any;
	private _body: any;
	private _willCompile: Promises.Deferred;

	constructor(scriptPath?: string) {
		super(scriptPath || './vendor/knockoutjs/index.js');
	}

	compile(source: string): Promises.Promise {
		this._willCompile = new Deferred();
		this.load(source).done(this.onWindow.bind(this));
		return this._willCompile.promise;
	}

	private onWindow(window: any): void {
		this.ko = window.ko;
		this._body = window.document.body;
		this._willCompile.resolve({
			render: this.onRender.bind(this)
		});
	}

	private onRender(context: {}): Promises.Promise {
		var rendering = new Deferred();
		setTimeout(() => {
			this.ko.applyBindings(context);
			rendering.resolve(this._body.innerHTML);
		});
		return rendering.promise;
	}
}

export = Knockout;
