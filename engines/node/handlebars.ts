///<reference path='../../vendor/dt-handlebars/handlebars.d.ts'/>
import Engine = require('../../lib/Engine');
import hb = require('handlebars');
import Promises = require('../../lib/Promises');
var Deferred = Promises.Deferred;


class Handlebars extends Engine {

	hb = hb;

	constructor() {
		super();
		this.onHandlebars(hb);
	}

	onHandlebars(hb: HandlebarsStatic) {}

	compile(source: string): Promises.Promise {
		var compiling = new Deferred();
		setTimeout(() => {
			var render = this.hb.compile(source);
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

export = Handlebars;
