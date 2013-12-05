///<reference path='../vendor/dt-node/node.d.ts'/>
///<reference path='../vendor/dt-express/express.d.ts'/>
var extend = require('extend');


export function bindTemplates(request: ExpressServerRequest, response: ExpressServerResponse) {
	var templateBinder = new TemplateBinder(response);
	templateBinder.bindTemplates(request.body);
	return templateBinder.boundTemplates;
}

interface BindRequestBody {
	engine?: string;
	data?: any;
	id?: string;
	source?: string;
	templates?: BindRequestBody[];
}

interface TemplatingEngine {
	compile: (source: string) => Promise;
}

interface Promise {
	/**
	* Add handlers to be called when the Deferred object is resolved.
	*/
	done: (callback: Function) => Promise;
	/**
	* Add handlers to be called when the Deffered object is rejected.
	*/
	fail: (callback: Function) => Promise;
	/**
	* Add handlers to be called when the Deffered object is either resolved
	* or rejected.
	*/
	always: (callback: Function) => Promise;
	/**
	* Add handlers to be called when the Deferred object generates progress
	* notifications.
	*/
	progress: (callback: Function) => Promise;
	/**
	* Add handlers to be called when the Deffered object is resolved, rejected
	* or still in progress.
	*/
	then: (done: Function, fail?: Function, progress?: Function) => Promise;
}

class TemplateBinder implements BindRequestBody {
	private response: ExpressServerResponse;
	private engines = {};
	private isValid: boolean;
	private hash: BindRequestBody;
	engine: string;
	data: any;
	id: string;
	source: string;
	boundTemplates = {};

	constructor(response: ExpressServerResponse) {
		this.response = response;
	}

	public bindTemplates(hash: BindRequestBody) {
		this.hash = hash;

		var templates = hash.templates;
		if (templates) {
			saveState.call(this);
			templates.forEach(this.bindTemplates.bind(this));
			restoreState.call(this);
			return;
		}

		// ReSharper disable MisuseOfOwnerFunctionThis
		function saveState() {
			this.savedState = {
				hash: this.hash,
				data: this.data,
				engine: this.engine
			};
		}

		function restoreState() {
			this.hash = hash;
			this.data = this.savedState.data;
			this.engine = this.savedState.engine;
		}
		// ReSharper restore MisuseOfOwnerFunctionThis

		this.validate();
		if (this.isValid) {
			this.compile();
		}
	}

	private validate() {
		var requireMethods = [
			this.requireId,
			this.requireSource,
			this.requireData,
			this.requireEngine
		];
		this.isValid = true;
		for (var i = 0; i < requireMethods.length; i++) {
			requireMethods[i].call(this);
			if (!this.isValid) {
				break;
			}
		}
	}

	private requireId() {
		this.id = this.hash.id;
		if (!this.id) {
			this.invalidate('missing required template id');
		}
	}

	private invalidate(message: string) {
		this.response.send(400, message);
		this.isValid = false;
	}

	private requireSource() {
		this.source = this.hash.source || this.source;
		if (!this.source) {
			this.invalidate('missing required template source');
		}
	}

	private requireData() {
		this.data = extend(this.hash.data, this.data || {});
		if (!this.data) {
			this.invalidate('missing required template data');
		}
	}

	private requireEngine() {
		var name = this.hash.engine;
		if (name) {
			this.tryLoadingEngine(name);
		}
		if (!this.engine) {
			this.invalidate('unspecified templating engine');
		}
	}

	private tryLoadingEngine(name: string) {
		try {
			this.engines[name] = require('../engines/' + name);
		} catch (e) {
			this.invalidate('unsupported templating engine');
		}
	}

	private compile() {
		this.engines[this.engine].compile(this.source)
			.done(this.addTemplate.bind(this));
	}

	private addTemplate(template: (data: any) => string) {
		this.boundTemplates[this.id] = template(this.data);
	}
}
