///<reference path='../vendor/dt-node/node.d.ts'/>
var jsdom = require('jsdom');
var fs = require('fs');


export class TemplatingEngine {

	private scriptPath: string;

	constructor(scriptPath?: string) {
		this.scriptPath = scriptPath;
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
				html: source,
				src: [lib],
				//features: {
				//	FetchExternalResources: false,
				//	ProcessExternalResources: false
				//},
				done: (errors, window) => {
					callback(window);
				}
			});
		});
	}
}
