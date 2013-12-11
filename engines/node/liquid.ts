import base = require('../base');
var liquid = require('liquid-node');


export class Liquid extends base.TemplatingEngine {

	liquid = liquid;

	compile(source: string, callback: Function) {
		callback(context => {
			return this.liquid.Template.parse(source).render(context);
		});
	}
}
