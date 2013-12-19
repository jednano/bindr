///<reference path='../vendor/dt-node/node.d.ts'/>
///<reference path='../vendor/dt-express/express.d.ts'/>
import express = require('express');
var extend = require('extend');
import base = require('../engines/base');
import Promises = require('./Promises');
var Deferred = Promises.Deferred;


export function bindTemplates(request: Request, response: Response): Promises.Promise {
	var templateBinder = new TemplateBinder(response);
	return templateBinder.bindTemplates(JSON.parse(request.body));
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
	binding?: Promises.Deferred;
}

class TemplateBinder implements BindRequest {
	private engines: { [key: string]: typeof base.TemplatingEngine } = {};
	private boundTemplates: { [key: string]: string } = {};

	constructor(private response: Response) {
	}

	public bindTemplates(context: BindRequest): Promises.Promise {

		var binding = new Deferred();
		var binders = [];

		if (context.engine && context.source && context.data) {
			var d = new Deferred();
			binders.push(d.promise);
			// ReSharper disable once InconsistentNaming
			this.tryLoadingEngine(context).then((Engine: typeof base.TemplatingEngine) => {
				new Engine().compile(context.source).done(template => {
					template.render(context.data || {}).done(html => {
						this.boundTemplates[context.id] = html;
						d.resolve();
					});
				});
			}, d.reject.bind(context.binding));
		}

		if (context.templates) {
			context.templates.forEach(template => {
				binders.push(this.bindTemplates(extend({
					engine: context.engine,
					data: context.data
				}, template)));
			});
		}

		Promises.when.apply(this, binders).done(() => {
			binding.resolve(this.boundTemplates);
		});

		return binding.promise;
	}

	private onBindComplete(id: string, html: string): void {
		this.boundTemplates[id] = html;
	}

	private tryLoadingEngine(context: BindRequest): Promises.Promise {
		var loading = new Deferred();
		var engineName = context.engine;
		setTimeout(() => {
			try {
				loading.resolve(this.engines[engineName] ||
				    require('../engines/' + engineName));
			} catch (e) {
				loading.reject('unsupported template engine');
			}
		});
		return loading.promise;
	}

	//private validate(): boolean {
	//	var requireMethods = [
	//		this.requireId,
	//		this.requireSource,
	//		this.requireData,
	//		this.requireEngine
	//	];
	//	var valid = true;
	//	for (var i = 0; i < requireMethods.length; i++) {
	//		valid = requireMethods[i].call(this, valid);
	//		if (!valid) {
	//			break;
	//		}
	//	}
	//	return valid;
	//}

	//private requireId(id: string) {
	//	if (!id) {
	//		this.invalidate('missing required template id');
	//	}
	//}

	private invalidate(message: string) {
		this.response.send(400, message);
	}

	//private requireSource() {
	//	this.source = this._bindRequest.source || this.source;
	//	if (!this.source) {
	//		this.invalidate('missing required template source');
	//	}
	//}

	//private requireData() {
	//	this.data = extend(this._bindRequest.data, this.data || {});
	//	if (!this.data) {
	//		this.invalidate('missing required template data');
	//	}
	//}

	//private requireEngine() {
	//	var name = this._bindRequest.engine;
	//	if (name) {
	//		this.tryLoadingEngine(name);
	//	}
	//	if (!this.engine) {
	//		this.invalidate('unspecified templating engine');
	//	}
	//}
}
