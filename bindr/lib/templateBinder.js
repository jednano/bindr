var extend = require('extend');


module.exports.bindTemplates = function(request, response) {
	var templateBinder = new TemplateBinder(response);
	templateBinder.bindTemplates(request.body);
	return templateBinder.boundTemplates;
};

function TemplateBinder(response) {
	this.response = response;
	this.engines = {};
	this.boundTemplates = {};
}

TemplateBinder.prototype = {

	bindTemplates: function(hash) {

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
	},

	validate: function() {
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
	},

	requireId: function() {
		this.id = this.hash.id;
		if (!this.id) {
			this.invalidate('missing required template id');
		}
	},

	invalidate: function(message) {
		this.response.send(400, message);
		this.isValid = false;
	},

	requireSource: function() {
		this.source = this.hash.source || this.source;
		if (!this.source) {
			this.invalidate('missing required template source');
		}
	},

	requireData: function() {
		this.data = extend(this.hash.data, this.data || {});
		if (!this.data) {
			this.invalidate('missing required template data');
		}
	},

	requireEngine: function() {
		var name = this.hash.engine;
		if (name) {
			this.tryLoadingEngine(name);
		}
		if (!this.engine) {
			this.invalidate('unspecified templating engine');
		}
	},

	tryLoadingEngine: function(name) {
		try {
			this.engine = this.engines[name] = require('../engines/' + name);
		} catch (e) {
			this.invalidate('unsupported templating engine');
		}
	},

	compile: function() {
		this.engine.compile(this.source).done(this.addTemplate.bind(this));
	},

	addTemplate: function(template) {
		this.boundTemplates[this.id] = template(this.data);
	}
};
