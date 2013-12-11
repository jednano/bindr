///<reference path='../vendor/dt-node/node.d.ts'/>
var jsdom = require('jsdom');
var fs = require('fs');
import Promises = require('../lib/Promises');
var Deferred = Promises.Deferred;


export class TemplatingEngine {

	constructor(private scriptPath?: string) {
	}

	load(source?: string): Promises.Promise {
		if (!this.scriptPath) {
			throw new Error('Not implemented');
		}
		var willLoadWindow = new Deferred();
		fs.readFile(this.scriptPath, { encoding: 'utf-8' }, (err, lib) => {
			if (err) {
				throw err;
			}
			jsdom.env({
				html: source || '<html><body></body></html>',
				src: [lib],
				features: {
					FetchExternalResources: false,
					ProcessExternalResources: false
				},
				done: (errors, window) => {
					willLoadWindow.resolve(window);
				}
			});
		});
		return willLoadWindow.promise;
	}
}
