import base = require('../base');
var liquid = require('liquid-node');
import Promises = require('../../lib/Promises');
var Deferred = Promises.Deferred;


export class Liquid extends base.TemplatingEngine {

	liquid = liquid;

	compile(source: string): Promises.Promise {
		var willCompile = new Deferred();
		setTimeout(() => {
			willCompile.resolve(this.liquid.Template.parse(source));
		});
		return willCompile.promise;
	}
}
