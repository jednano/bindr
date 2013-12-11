///<reference path='../vendor/dt-node/node.d.ts'/>
import Promises = require('../lib/Promises');
var jsdom = require('jsdom');
var fs = require('fs');


export class TemplatingEngine {

	constructor(private scriptPath?: string) {
	}

	load(source: string, callback: Function) {
		if (!this.scriptPath) {
			throw new Error('Not implemented');
		}
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
					callback(window);
				}
			});
		});
	}
}
