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
}

class TemplateBinder implements BindRequest {
	private engines: { [key: string]: typeof base.TemplatingEngine } = {};
	private boundTemplates: { [key: string]: string } = {};
	private valid: boolean;
	private binding: Promises.Deferred;

	constructor(private response: Response) {
	}

	public bindTemplates(context: BindRequest): Promises.Promise {

		var binding = this.binding = new Deferred();
		if (!this.validate(context)) {
			return binding.promise;
		}

		var binders = [];
		if (context.engine && context.source && context.data) {
			var rendering = new Deferred();
			binders.push(rendering.promise);
			// ReSharper disable once InconsistentNaming
			this.tryLoadingEngine(context).then((Engine: typeof base.TemplatingEngine) => {
				new Engine().compile(context.source).done(template => {
					template.render(context.data).done(html => {
						this.boundTemplates[context.id] = html;
						rendering.resolve();
					});
				});
			}, rendering.reject);
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

	private validate(context: BindRequest): boolean {
		var requireMethods = [
			this.requireId,
			this.requireSource,
			this.requireData,
			this.requireEngine
		];
		var valid = true;
		for (var i = 0; i < requireMethods.length; i++) {
			valid = requireMethods[i](context);
			if (!valid) {
				break;
			}
		}
		return valid;
	}

	private requireId(context: BindRequest): boolean {
		if (!context.id) {
			this.invalidate('missing required template id');
			return false;
		}
		return true;
	}

	private invalidate(message: string) {
		this.binding.reject(message);
		this.response.send(400, message);
	}

	private requireSource(context: BindRequest): boolean {
		if (!context.source) {
			this.invalidate('missing required template source');
			return false;
		}
		return true;
	}

	private requireData(context: BindRequest): boolean {
		if (!context.data) {
			this.invalidate('missing required template data');
			return false;
		}
		return true;
	}

	private requireEngine(context: BindRequest): boolean {
		if (!context.engine) {
			this.invalidate('unspecified templating engine');
			return false;
		}
		return true;
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
}
