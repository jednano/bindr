///<reference path='../../vendor/dt-handlebars/handlebars.d.ts'/>
import base = require('../base');
var hb: HandlebarsStatic = require('handlebars');
import Promises = require('../../lib/Promises');
var Deferred = Promises.Deferred;


export class Handlebars extends base.TemplatingEngine {

	hb = hb;
	private _render: Function;

	compile(source: string): Promises.Promise {
		this._render = this.hb.compile(source);
		var willCompile = new Deferred();
		setTimeout(() => {
			willCompile.resolve({
				render: this.onRender.bind(this)
			});
		});
		return willCompile.promise;
	}

	private onRender(context: {}): Promises.Promise {
		var willRender = new Deferred();
		setTimeout(() => {
			willRender.resolve(this._render(context));
		});
		return willRender.promise;
	}
}
