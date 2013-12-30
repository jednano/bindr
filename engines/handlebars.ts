///<reference path='../vendor/dt-handlebars/handlebars.d.ts'/>
import Engine = require('../lib/Engine');
import Promises = require('../lib/Promises');
var Deferred = Promises.Deferred;


class Handlebars extends Engine {

	constructor(scriptPath?: string) {
		super(scriptPath || './vendor/handlebars/handlebars.js');
	}

	compile(source: string): Promises.Promise {
		var compiling = new Deferred();
		setTimeout(() => {
			this.load().done((window: any) => {
				var hb = <HandlebarsStatic>window.Handlebars;
				this.onHandlebars(hb);
				var render = hb.compile(source);
				compiling.resolve({
					render: this.onRender.bind(this, render)
				});
			});
		});
		return compiling.promise;
	}

	onHandlebars(hb: HandlebarsStatic) {}

	private onRender(render: Function, context: {}): Promises.Promise {
		var rendering = new Deferred();
		setTimeout(() => {
			rendering.resolve(render(context));
		});
		return rendering.promise;
	}
}

export = Handlebars;
