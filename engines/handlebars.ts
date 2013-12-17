///<reference path='../vendor/dt-handlebars/handlebars.d.ts'/>
import base = require('./base');
import Promises = require('../lib/Promises');
var Deferred = Promises.Deferred;


class Handlebars extends base.TemplatingEngine {

	hb: HandlebarsStatic;
	private _compiling: Promises.Deferred;
	private _source: string;
	private _render: Function;

	constructor(scriptPath?: string) {
		super(scriptPath || './vendor/handlebars/handlebars.js');
	}

	compile(source: string): Promises.Promise {
		this._source = source;
		this._compiling = new Deferred();
		this.load().done(this.onWindow.bind(this));
		return this._compiling.promise;
	}

	private onWindow(window: any): void {
		this.hb = window.Handlebars;
		this._render = this.hb.compile(this._source);
		this._compiling.resolve({
			render: this.onRender.bind(this)
		});
	}

	private onRender(context: {}): Promises.Promise {
		var rendering = new Deferred();
		setTimeout(() => {
			rendering.resolve(this._render(context));
		});
		return rendering.promise;
	}
}

export = Handlebars;
