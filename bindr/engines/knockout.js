var jsdom = require('jsdom');
var fs = require('fs');


jsdom.defaultDocumentFeatures = {
	FetchExternalResources: false,
	ProcessExternalResources: false
};

fs.readFile('../lib/vendor/knockoutjs/index.js',
	{
		encoding: 'utf-8'
	},
	function(err, knockoutjs) {
		jsdom.env({
			html: '<html><body></body></html>',
			src: [knockoutjs],
			done: function(errors, window) {
				module.exports = {
					compile: function(source) {
						return {
							done: function(data) {
								var doc = jsdom.jsdom(source);
								return window.ko.applyBindings(data, doc);
							}
						};
					}
				};
			}
		});
	}
);
