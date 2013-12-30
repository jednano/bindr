import Engine = require('../../lib/Engine');
var swig = new (require('swig')).Swig();
import Promises = require('../../lib/Promises');
var Deferred = Promises.Deferred;


class Swig extends Engine {

	swig = swig;

	compile(source: string): Promises.Promise {
		var compiling = new Deferred();
		setTimeout(() => {
			var render = context => {
				return this.swig.render(source, context);
			};
			compiling.resolve({
				render: this.onRender.bind(this, render)
			});
		});
		return compiling.promise;
	}

	private onRender(render: Function, context: {}): Promises.Promise {
		var rendering = new Deferred();
		setTimeout(() => {
			rendering.resolve(render(context));
		});
		return rendering.promise;
	}
}

export = Swig;
