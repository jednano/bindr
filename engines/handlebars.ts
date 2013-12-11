///<reference path='../vendor/dt-handlebars/handlebars.d.ts'/>
import base = require('./base');
import Promises = require('../lib/Promises');
var Deferred = Promises.Deferred;


export class Handlebars extends base.TemplatingEngine {

	hb: HandlebarsStatic;
	private _willCompile: Promises.Deferred;
	private _source: string;
	private _render: Function;

	constructor(scriptPath?: string) {
		super(scriptPath || './vendor/handlebars/handlebars.js');
	}

	compile(source: string): Promises.Promise {
		this._source = source;
		this._willCompile = new Deferred();
		this.load().done(this.onWindow.bind(this));
		return this._willCompile.promise;
	}

	private onWindow(window: any): void {
		this.hb = window.Handlebars;
		this._render = this.hb.compile(this._source);
		this._willCompile.resolve({
			render: this.onRender.bind(this)
		});
	}

	private onRender(context: {}): Promises.Promise {
		var willRender = new Deferred();
		setTimeout(() => {
			willRender.resolve(this._render(context));
		});
		return willRender.promise;
	}
}
