import base = require('../base');
var swig = new (require('swig')).Swig();
import Promises = require('../../lib/Promises');
var Deferred = Promises.Deferred;


export class Swig extends base.TemplatingEngine {

	swig = swig;
	private _render: Function;

	compile(source: string): Promises.Promise {
		this._render = context => {
			return this.swig.render(source, context);
		};
		var compiling = new Deferred();
		setTimeout(() => {
			compiling.resolve({
				render: this.onRender.bind(this)
			});
		});
		return compiling.promise;
	}

	private onRender(context: {}): Promises.Promise {
		var rendering = new Deferred();
		setTimeout(() => {
			rendering.resolve(this._render(context));
		});
		return rendering.promise;
	}
}
