import Engine = require('../../lib/Engine');
var liquid = require('liquid-node');
import Promises = require('../../lib/Promises');
var Deferred = Promises.Deferred;


class Liquid extends Engine {

	liquid = liquid;

	compile(source: string): Promises.Promise {
		var compiling = new Deferred();
		setTimeout(() => {
			compiling.resolve(this.liquid.Template.parse(source));
		});
		return compiling.promise;
	}
}

export = Liquid;
