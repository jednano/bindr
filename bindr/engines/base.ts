///<reference path='../vendor/dt-node/node.d.ts'/>
var jsdom = require('jsdom');
var fs = require('fs');


export class TemplatingEngineLoader {
	private scriptPath: string;
	private loadCallback: Function;
	private Engine: typeof TemplatingEngine;
	engine: TemplatingEngine;

	constructor(engineClass: typeof TemplatingEngine, scriptPath?: string) {
		this.Engine = engineClass;
		this.scriptPath = scriptPath;
	}

	load(callback: Function) {
		this.loadCallback = callback;
		if (!this.scriptPath) {
			this.engine = new this.Engine();
			this.loadCallback(this.engine);
			return;
		}
		fs.readFile(this.scriptPath, { encoding: 'utf-8' }, (err, lib) => {
			if (err) {
				throw err;
			}
			jsdom.env({
				html: '<html><body></body></html>',
				src: [lib],
				//features: {
				//	FetchExternalResources: false,
				//	ProcessExternalResources: false
				//},
				done: (errors, window) => {
					this.loadCallback(new this.Engine(window));
				}
			});
		});
	}
}

export class TemplatingEngine {
	window: any;
	helpers = {
		createDocumentFragment: (source: string) => {
			return jsdom.jsdom(source).firstChild;
		}
	};

	constructor(window?: any) {
		this.window = window;
	}

	compile(source: string, callback: Function) {
		throw new Error('Not implemented');
	}
}
