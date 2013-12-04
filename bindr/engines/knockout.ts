///<reference path='../vendor/dt-node/node.d.ts'/>


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
	(err, knockoutjs) => {
		jsdom.env({
			html: '<html><body></body></html>',
			src: [knockoutjs],
			done: (errors, window) => {
				exports = {
					compile: source => {
						return {
							done: data => {
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
