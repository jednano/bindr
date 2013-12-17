///<reference path='../vendor/dt-node/node.d.ts'/>
///<reference path='../vendor/dt-express/express.d.ts'/>
import express = require('express');
var extend = require('extend');
import base = require('../engines/base');


export function bindTemplates(request: Request, response: Response) {
	var templateBinder = new TemplateBinder(response);
	templateBinder.bindTemplates(request.body);
	return templateBinder.boundTemplates;
}

export interface Request {
	body: string;
}

export interface Response {
	send(statusOrBody: any, body?: any): Response;
	json(statusOrBody: any, body?: any): Response;
}

interface BindRequest {
	engine?: string;
	data?: any;
	id?: string;
	source?: string;
	templates?: BindRequest[];
}

class TemplateBinder implements BindRequest {
	private _engines = {};
	private _isValid: boolean;
	private _bindRequest: BindRequest;
	engine: string;
	data: any;
	id: string;
	source: string;
	boundTemplates = {};

	// ReSharper disable once InconsistentNaming
	constructor(private _response: Response) {
	}

	public bindTemplates(bindRequest: BindRequest) {
		this._bindRequest = bindRequest;

		var templates = bindRequest.templates;
		if (templates) {
			saveState.call(this);
			templates.forEach(this.bindTemplates.bind(this));
			restoreState.call(this);
			return;
		}

		// ReSharper disable MisuseOfOwnerFunctionThis
		function saveState() {
			this.savedState = {
				_bindRequest: this._bindRequest,
				data: this.data,
				engine: this.engine
			};
		}

		function restoreState() {
			this._bindRequest = bindRequest;
			this.data = this.savedState.data;
			this.engine = this.savedState.engine;
		}
		// ReSharper restore MisuseOfOwnerFunctionThis

		this.validate();
		if (this._isValid) {
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
		this._isValid = true;
		for (var i = 0; i < requireMethods.length; i++) {
			requireMethods[i].call(this);
			if (!this._isValid) {
				break;
			}
		}
	}

	private requireId() {
		this.id = this._bindRequest.id;
		if (!this.id) {
			this.invalidate('missing required template id');
		}
	}

	private invalidate(message: string) {
		this._response.send(400, message);
		this._isValid = false;
	}

	private requireSource() {
		this.source = this._bindRequest.source || this.source;
		if (!this.source) {
			this.invalidate('missing required template source');
		}
	}

	private requireData() {
		this.data = extend(this._bindRequest.data, this.data || {});
		if (!this.data) {
			this.invalidate('missing required template data');
		}
	}

	private requireEngine() {
		var name = this._bindRequest.engine;
		if (name) {
			this.tryLoadingEngine(name);
		}
		if (!this.engine) {
			this.invalidate('unspecified templating engine');
		}
	}

	private tryLoadingEngine(name: string) {
		try {
			this._engines[name] = require('../engines/' + name);
		} catch (e) {
			this.invalidate('unsupported templating engine');
		}
	}

	private compile() {
		this._engines[this.engine].compile(this.source)
			.done(this.addTemplate.bind(this));
	}

	private addTemplate(template: (data: any) => string) {
		this.boundTemplates[this.id] = template(this.data);
	}
}
